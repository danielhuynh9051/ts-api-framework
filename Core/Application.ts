import * as http from 'http';

import express = require('express');
import * as morgan from 'morgan';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction } from 'express';
import * as formidableMiddleware from 'express-formidable';
import * as compression from 'compression';

import { Injectable } from './Injectable';
import { Router } from './Router';
// import { RoleBasedAccessControl as RBAC } from './RBAC';
import { Swagger } from './Swagger';
import { Security } from './Security';
import { Config } from './Config';
import { BaseError, NotFound, MethodNotAllowed } from './Error';

import { MorganFormat } from './Enum/Morgan';
import { FileStorage } from './FileStorage';
import { I18n } from './I18n';
import { BadRequest } from './Error/BadRequest';
import { Database } from './Database';

var debug = require('debug')('ts-api-framework:server');
var rfs = require('rotating-file-stream');

@Injectable
export class Application {
    private _app = express();
    private _server = http.createServer(this._app);
    private _publicHost: string;
    private _publicPort: number;
    private _host: string;
    private _port: number;
    private _scheme: string;
    private _docPath: string;

    constructor(
        private readonly _config: Config,
        private readonly _database: Database,
        private readonly _router: Router,
        // private readonly _rbac: RBAC,
        private readonly _swagger: Swagger,
        private readonly _security: Security,
        private readonly _fileStorage: FileStorage,
        private readonly _i18n: I18n
    ) {
        this._publicHost = this._config.server.public.host;
        this._publicPort = this._config.server.public.port;
        this._host = this._config.server.host;
        this._port = this._config.server.port;
        this._scheme = this._config.server.scheme;
        this._docPath = this._config.document.path;
    }

    public async start() {
        console.log('------------------INITIALIZE-------------------');

        await this._database.connect();

        await this._configExpress();

        this._startServer();

        console.log('-----------------------------------------------');

        console.log(
            `Server has been running on: ${this._scheme}://${this._publicHost}:${this._publicPort}/${
            this._config.version
            }`
        );

        if (this._config.document.enable) {
            console.log(
                `Document has been running on: ${this._scheme}://${this._publicHost}:${this._publicPort}/${
                this._config.version
                }/${this._docPath}`
            );
        }

        console.log('');

        console.log('--------------------PROCESS--------------------');

        console.log('Waiting for log...');
    }

    private async _configExpress() {
        console.log('Configuring ExpressJS...');

        // compress gzip
        this._app.use(compression());

        // Config CORS
        this._app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', this._config.server.cors_allow_origin);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

            next();
        });

        // Config Logger
        var accessLogStream = rfs('server.log', {
            interval: '1d', // rotate daily
            path: path.join(__dirname, '..', 'Logs')
        });

        const morganFormat = this._config.env == 'dev' ? MorganFormat.dev : MorganFormat.full;

        morgan.token('err', function (req, res) {
            return req['err'];
        });

        this._app.use(
            morgan(morganFormat, {
                skip: function (req, res) {
                    return res.statusCode < 300;
                },
                stream: accessLogStream
            })
        );

        this._app.use(
            morgan(morganFormat, {
                skip: function (req, res) {
                    return res.statusCode < 300;
                }
            })
        );

        this._app.use(
            formidableMiddleware({
                encoding: 'utf-8',
                uploadDir: this._config.storage.tmp
            })
        );

        // parse error
        this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            next(new BadRequest({ request: err.message }));
        });

        // Set JWT
        this._app.use(this._security.decodeToken.bind(this._security));

        // Set Role Base Access Control
        if (this._config.security.RBAC) {
            // await this._rbac.load();
            // await this._rbac.loadBlacklist();
        }

        // Router config
        this._app.use(`/${this._config.version}`, this._router.expressRouter);

        // Swagger Document URL
        if (this._config.document.enable) {
            this._app.use(
                `/${this._config.version}/${this._docPath}`,
                swaggerUi.serve,
                swaggerUi.setup(null, this._swagger.opts)
            );
        }

        // Config Not Found
        this._app.use((req: Request, res: Response, next: NextFunction) => {
            const err = new NotFound();

            if ('OPTIONS' === req.method) {
                res.status(200).send();
            } else {
                next(err);
            }
        });

        // Error Handler
        this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            req['err'] =
                JSON.stringify(
                    {
                        err: err.name,
                        msg: err.message,
                        request_body: req.body,
                        request_file: req.files,
                        request_header: req.headers
                    },
                    null,
                    4
                ) +
                '\n' +
                err.stack;

            if (err instanceof MethodNotAllowed) {
                res.status(err.status).send();
            } else if (err instanceof BadRequest) {
                for (let key in err.message.fields) {
                    err.message.fields[key] = this._i18n.get(err.message.fields[key], req.acceptsLanguages()[0]);
                }
                res.status(err.status).json({ code: err.status, error: err.message });
            } else if (err instanceof BaseError) {
                let msg = this._i18n.get(err.message, req.acceptsLanguages()[0]);

                res.status(err.status).json({ code: err.status, error: msg, variant: err.message });
            } else if (err instanceof SyntaxError) {
                res.status(400).json({ code: 400, error: { fields: { body: err.message } } });
            } else {
                let msg = this._i18n.get('INTERNAL_ERROR', req.acceptsLanguages()[0]);

                res.status(500).json({ code: 500, error: msg });
            }
        });

        console.log('Configuring ExpressJS - DONE');
    }

    private _startServer() {
        console.log('Starting Server...');
        this._server.listen(this._port, this._host);
        this._server.on('listening', this._serverListening.bind(this));
        this._server.on('error', this._serverListenError.bind(this));
        console.log('Starting Server - DONE');
    }

    private _serverListenError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof this._port === 'string' ? 'Pipe ' + this._port : 'Port ' + this._port;

        // Handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private _serverListening() {
        const addr = this._server.address();
        let bind = '';
        if (addr) {
            if (typeof addr === 'string') {
                bind = 'pipe ' + addr;
            } else {
                bind = 'port ' + addr.port;
            }
        }
        debug('Listening on ' + bind);
    }
}

import { Config } from 'Core/Config';

const ENABLE_DOCUMENT = process.env.ENABLE_DOCUMENT == 'true' || !process.env.ENABLE_DOCUMENT ? true : false;
const ENABLE_RBAC = process.env.ENABLE_RBAC == 'true' || !process.env.ENABLE_RBAC ? true : false;
const DB_DEBUG = process.env.DB_DEBUG == 'true' || !process.env.DB_DEBUG ? true : false;
const DB_SYNC = process.env.DB_SYNC == 'true' || !process.env.DB_SYNC ? true : false;

export const config: Config = {
    env: process.env.ENV || 'dev',
    version: 'v1.0',
    lang: process.env.LANG || 'en',
    internal_ip: parseArray(process.env.INTERNAL_IP || '127.0.0.1'),
    jwt: {
        key: process.env.JWT_KEY || 'some-key',
        expire: process.env.JWT_EXPIRE || '12h',
        remember: process.env.JWT_REMEMBER || '90d'
    },
    server: {
        host: process.env.SERVER_HOST || '127.0.0.1',
        port: normalize(process.env.SERVER_PORT || 8080),
        public: {
            // Config for Swagger UI
            host: process.env.SERVER_PUBLIC_HOST || process.env.SERVER_HOST || '127.0.0.1',
            port: normalize(process.env.SERVER_PUBLIC_PORT || 8080)
        },
        scheme: process.env.SERVER_SCHEMA || 'http',
        cors_allow_origin: process.env.CORS_ALLOW_ORIGIN || 'null'
    },
    document: {
        path: 'docs',
        enable: ENABLE_DOCUMENT
    },
    security: {
        pepper: 'V1r4lW0rk5_2018',
        RBAC: ENABLE_RBAC
    },
    storage: {
        tmp: process.env.UPLOAD_DIR || './tmp-upload',
        dir: process.env.STORAGE_DIRECTORY || './Storage'
    },
    database: {
        connection: {
            type: process.env.DB_TYPE || 'postgres',
            host: process.env.DB_HOST || '165.22.255.74',
            port: normalize(process.env.DB_PORT || 5432),
            username: process.env.DB_USERNAME || 'pmt_dev',
            password: process.env.DB_PASSWORD || 'ViralWorks123!@#',
            database: process.env.DB_DB || 'pmt'
        },
        sync: DB_SYNC,
        debug: DB_DEBUG
    }
};

function normalize(val: any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function parseArray(str: string = '') {
    return str.split(',');
}

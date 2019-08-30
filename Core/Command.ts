import { Injectable } from './Injectable';
import { Config } from './Config';
import { Command as AppCommand } from 'App/Command';
import { Router } from './Router';
import { Database } from './Database';

@Injectable
export class Command {
    private args: string[] = [];

    constructor(
        private readonly _config: Config,
        private readonly _database: Database,
        private readonly _router: Router,
        private readonly _appCommand: AppCommand
    ) {}

    public async start(args: string[]) {
        this.args = args;
        await this._database.connect();

        return this._feature(args[0]);
    }

    private async _feature(args: string) {
        if (args == '--ver') {
            return this._version();
        } else if (args == '--config') {
            return this._configuration();
        } else if (args.indexOf('--run=') > -1) {
            const key = args.split('=')[1];
            return this._runCommand(key);
        } else {
            process.exit();
        }
    }

    private _version() {
        return 'TS API Framework: ' + this._config.version;
    }

    private _configuration() {
        return this._config;
    }

    private async _runCommand(key: string) {
        if (this._appCommand.commands[key]) {
            const params = this.args.slice(1);
            return this._appCommand.commands[key].run(...params);
        } else {
            return 'Command does not exist';
        }
    }
}

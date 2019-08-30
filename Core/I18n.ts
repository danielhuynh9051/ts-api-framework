import { Injectable } from 'Core/Injectable';
import { Config } from 'Core/Config';
import { en } from 'I18n/en';
import { vi } from 'I18n/vi';

require('Core/Helpers/Log');

@Injectable
export class I18n {
    constructor(private readonly _config: Config) {}

    private lang = {
        en: en,
        vi: vi
    };

    get(message: string, locale: string) {
        if (!this.lang[locale]) locale = this._config.lang;

        locale = locale.substring(0, 2);

        if (this._config.env === 'dev') console.log('Err: ' + message);

        return this.lang[locale][message] || this.lang[locale]['INTERNAL_ERROR'];
    }
}

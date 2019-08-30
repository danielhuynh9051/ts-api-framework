import * as path from 'path';

const defaultNameLog = 'errors-log';

export class LogError {
    static _logs: any;
    static nameLog: string;

    static logs(name: string) {
        this.nameLog = name;
        return this;
    }

    static getInstance() {
        if (!LogError._logs) {
            if (!this.nameLog) {
                this.nameLog = defaultNameLog;
            }
            const rfs = require('rotating-file-stream');
            LogError._logs = rfs(`${this.nameLog}.log`, {
                interval: '1d', // rotate daily
                path: path.join(__dirname, '../../', 'log'),
                size: '10M'
            });
        }
        return LogError._logs;
    }

    static addLog(text: string | string[]) {
        try {
            const time = new Date();
            let data = `\n ${time}`;
            if (typeof text == 'string') {
                data += `\n\t ${text}`;
            } else if (text && text.length) {
                for (const t of text) {
                    data += `\n\t ${t}`;
                }
            }
            return LogError.getInstance().write(data);
        } catch (e) {
            console.log('ERROR SAVE LOG: ');
            console.log(e);
        }
    }
}

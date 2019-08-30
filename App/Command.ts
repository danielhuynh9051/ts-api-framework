import { Injectable } from 'Core/Injectable';
import { ICommand } from 'Core/Interface';
import { DestroyDatabase } from './Command/DestroyDatabase';

@Injectable
export class Command {
    readonly commands: { [key: string]: ICommand };
    constructor(
        destroyDatabase: DestroyDatabase
    ) {
        this.commands = {
            DestroyDatabase: destroyDatabase
        };
    }
}

import { Injectable } from "Core/Injectable";
import { createConnection, Connection, EntityManager } from 'typeorm';
import * as ormconfig from 'Config/ormconfig';

export * from './Database/BaseEntity';

@Injectable
export class Database {
    private _connection: Connection;

    constructor() { }

    /**
     * Create a connection to Database
     * @return Connection object
     */
    async connect() {
        if (!this._connection) {
            if (ormconfig.entities) {
                ormconfig.entities.push('Core/Database/Models/!(*.Base).ts');
                ormconfig.entities.push('Core/Database/Models/**/!(*.Base).ts');
            } else {
                Object.assign(ormconfig.entities, [
                    'Core/Database/Models/!(*.Base).ts',
                    'Core/Database/Models/**/!(*.Base).ts'
                ]);
            }

            this._connection = await createConnection(ormconfig);
        }

        return this._connection;
    }

    get connection() {
        return this._connection;
    }

    transaction<T>(f: (session: EntityManager) => Promise<T>) {
        return this._connection.transaction(async transactionManager => {
            return f(transactionManager);
        })
    }
}
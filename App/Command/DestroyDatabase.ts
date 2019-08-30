import { Injectable } from 'Core/Injectable';
import { ICommand } from 'Core/Interface';
import { getMetadataArgsStorage } from 'typeorm';
import { Database } from 'Core/Database';

@Injectable
export class DestroyDatabase implements ICommand {
    constructor(
        private readonly _db: Database
    ) { }

    public async run() {
        const queryRunner = this._db.connection.createQueryRunner();
        const tableNames = getMetadataArgsStorage().tables.map(table => {
            if (table.name) return table.name;
        });

        if (tableNames && tableNames.length > 0) {
            const tableInstances = await queryRunner.getTables(tableNames as string[]);

            for (const table of tableInstances) {
                console.log('Dropping Foreign Keys from table [' + table.name + ']...');
                await queryRunner.dropForeignKeys(table, table.foreignKeys);
            }

            for (const table of tableInstances) {
                console.log('Dropping table [' + table.name + ']...');
                await queryRunner.dropTable(table);
            }
        }

        return 'Done';
    }
}

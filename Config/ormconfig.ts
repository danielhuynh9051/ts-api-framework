require('dotenv').config();
import { ConnectionOptions } from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { config } from './config';

const connection: ConnectionOptions = {
    ...config.database.connection,
    logging: config.database.debug ? "all" : false as LoggerOptions,
    logger: "advanced-console",
    migrationsRun: config.database.sync,
    synchronize: config.database.sync,
    migrationsTableName: "typeorm_migrations",
    migrations: ["Database/Postgres/*.ts"],
    entities: ["App/Models/Postgres/**/*.ts"],
    cli: {
        "migrationsDir": "Database/Postgres",
        "entitiesDir": "App/Models/Postgres"
    },
    uuidExtension: "uuid-ossp",
    cache: true
};
export = connection;
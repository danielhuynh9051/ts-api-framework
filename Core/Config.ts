export abstract class Config {
    readonly env: string;
    readonly version: string;
    readonly lang: string;
    readonly internal_ip: string[];
    readonly jwt: {
        readonly key: string;
        readonly expire: string;
        readonly remember: string;
    };
    readonly server: {
        readonly host: string;
        readonly port: number;
        readonly public: {
            readonly host: string;
            readonly port: number;
        };
        readonly scheme: string;
        readonly cors_allow_origin: string;
    };
    readonly document: {
        readonly path: string;
        readonly enable: boolean;
    };
    readonly security: {
        readonly pepper: string;
        readonly RBAC: boolean;
    };
    readonly database: {
        readonly connection: {
            readonly type: 'postgres' | 'mysql' | 'mssql' | any;
            readonly host: string;
            readonly port: number;
            readonly username: string;
            readonly password: string;
            readonly database: string
        };
        readonly sync: boolean;
        readonly debug: boolean;
    };
    readonly storage: {
        readonly tmp: string;
        readonly dir: string;
    };
}

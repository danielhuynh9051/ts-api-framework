declare namespace Express {
    export interface Request {
        auth: {
            id?: string;
            name?: string;
            type?: string;
            roles?: string[];
        };
        routePath: string;
    }
}
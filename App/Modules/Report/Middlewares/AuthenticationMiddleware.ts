import { Config } from 'Core/Config';
import { Injectable } from 'Core/Injectable';
import { Request, NextFunction } from 'express';
import { IMiddleware } from 'Core/Interface';
import { Unauthorized } from 'Core/Error';

@Injectable
export class AuthenticationMiddleware implements IMiddleware {
    constructor(readonly config: Config) {}

    public async handle(req: Request, next: NextFunction) {
        if (!req.auth.id) {
            return next(new Unauthorized());
        }
        return next();
    }
}

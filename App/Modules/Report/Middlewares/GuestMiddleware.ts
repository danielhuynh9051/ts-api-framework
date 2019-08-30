import { Config } from 'Core/Config';
import { Injectable } from 'Core/Injectable';
import { Request, NextFunction } from 'express';
import { IMiddleware } from 'Core/Interface';

@Injectable
export class GuestMiddleware implements IMiddleware {
    constructor(readonly config: Config) {}

    public async handle(req: Request, next: NextFunction) {
        if (!req.auth.roles) req.auth.roles = []

        req.auth.roles.push('guest')
        
        return next();
    }
}
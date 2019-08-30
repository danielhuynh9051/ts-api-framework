import { Injectable } from 'Core/Injectable';
import { IRoute, IRouter } from 'Core/Interface';
import { HTTP } from 'Core/Enum';
import { ReportController } from './Controllers/ReportController';

import { AuthenticationMiddleware } from './Middlewares/AuthenticationMiddleware';

@Injectable
export class Router implements IRouter {
    readonly routes: IRoute[];
    constructor(
        // Controller
        readonly reportController: ReportController,
        // Middleware
        readonly authenticationMiddleware: AuthenticationMiddleware
    ) {
        this.routes = [
            {
                middleware: [{ class: this.authenticationMiddleware }],
                group: [
                    { path: '/{id}/excel', method: HTTP.Post, handler: this.reportController.importExcel },
                    { path: '/{id}/excel', method: HTTP.Get, handler: this.reportController.exportReport }
                ]
            }
        ];
    }
}

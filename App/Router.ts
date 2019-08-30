import { Injectable } from 'Core/Injectable';
import { IRouteModule, IModuleRouter } from 'Core/Interface';
import { Router as ReportRoute } from './Modules/Report/Router';

@Injectable
export class Router implements IModuleRouter {
    readonly routes: { [module: string]: IRouteModule };
    constructor(readonly reportRoute: ReportRoute) {
        this.routes = {
            report: { path: 'reports', group: this.reportRoute.routes, description: 'Report Service document' }
        };
    }
}

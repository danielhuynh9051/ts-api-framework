import 'reflect-metadata';
import { BaseEntity } from 'Core/Database';
import { getMetadataArgsStorage, ManyToMany } from 'typeorm';
import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { Injectable } from './Injectable';
import { Config } from './Config';
import * as RE from './RegularExpression';
import { SystemError, Forbidden } from './Error';
import { HTTP } from './Enum';
import { RoleBasedAccessControlService as Service } from './RBAC/Service';
import { Unauthorized } from './Error/Unauthorized';
import { Role } from './Database/Models/RBAC/Role';
import { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs';
import { JoinTableMetadataArgs } from 'typeorm/metadata-args/JoinTableMetadataArgs';

export * from './Database/Models/RBAC/Role';
export * from './Database/Models/RBAC/Permission';
export * from './Database/Models/RBAC/BlackList';

export * from './Interface/RBAC';

export const RBAC_USER = new Map<string, Function>();

export function RBACRole(target: any, prop: string) {
    const entityName = target.constructor.name.toLowerCase();
    getMetadataArgsStorage().relations.push({
        target: target.constructor,
        propertyName: prop,
        relationType: 'many-to-many',
        isLazy: false,
        type: type => Role,
        inverseSideProperty: undefined,
        options: {}
    } as RelationMetadataArgs);

    getMetadataArgsStorage().joinTables.push({
        target: target.constructor,
        propertyName: prop,
        name: `${entityName}_role`,
        joinColumns: [{
            name: `${entityName}_id`,
            referencedColumnName: 'id'
        }],
        inverseJoinColumns: [{
            name: 'role_id',
            referencedColumnName: 'id'
        }],
        schema: undefined,
        database: undefined
    } as JoinTableMetadataArgs);

    if (!RBAC_USER.has(entityName)) {
        RBAC_USER.set(entityName, target.constructor);
    }
}

// @Injectable
// export class RoleBasedAccessControl {
//     private _roles: Role[];
//     private _permissions: Permission[];

//     constructor(private readonly _config: Config, private readonly _service: Service) { }

//     async load() {
//         console.log('Updating RBAC system...');

//         // this._roles = await this._service.findRoles();

//         // this._permissions = await this._service.findPermissions();

//         console.log('Updating RBAC system - DONE');
//     }

//     async loadBlacklist() {
//         // return this._service.loadBlacklist();
//     }

//     addRoutePath(moduleName: string, path: string, method: HTTP, name?: string) {
//         if (!RE.checkModuleName.test(moduleName)) {
//             throw new SystemError(`Module name "${moduleName}" is invalid format. It must be ${RE.checkModuleName}`);
//         }

//         if (!RE.checkRoutePath.test(path)) {
//             throw new SystemError(`Path "${path}" is invalid format. It must be ${RE.checkRoutePath}`);
//         }

//         if (!this._service.routePathsWithModule[moduleName]) {
//             this._service.routePathsWithModule[moduleName] = [];
//         }

//         this._service.routePathsWithModule[moduleName].push({ path, method, name });
//         this._service.routePaths.push({ path, method, name: moduleName.toUpperCase() + ': ' + name });
//         this._service.paths.push(path);
//     }

//     private _handler(path: string, method: string, roles: string[] = []) {
//         // Find permission by path and method
//         const permission = this._permissions.find(item => item.route.path == path && item.route.method == method);

//         // Permission doesn't exist, deny all
//         if (!permission) return false;

//         // Permisisons exists and doesn't have roles, block all
//         if (permission.roles.length > 0) {
//             if (roles.length > 0) {
//                 // Make a list of available roles then find intersection
//                 const tmp = this._roles.filter(item => _.includes(roles, item.id));

//                 let roleCollection: any = _.flattenDeep([roles, tmp.map(item => item.parents.map(i => i.toString()))]);

//                 return _.intersection(permission.roles.map(item => item.toString()), roleCollection).length > 0
//                     ? true
//                     : false;
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }
//     }

//     middleware(req: Request, res: Response, next: NextFunction) {
//         // let user = {
//         //     id_string: req.auth.id || '',
//         //     // fix silly bug between miliseconds and seconds
//         //     token_created_at: (req.auth.iat + 1) * 1000
//         // };

//         // let blacklistIndex = this._service._blacklist.findIndex(obj => {
//         //     // user is disable
//         //     if (obj.disabled_user.id_string === user.id_string && obj.disabled_user.reason === BlacklistReason.DISABLE)
//         //         return true;

//         //     return false;
//         // });

//         // if (
//         //     blacklistIndex !== -1 &&
//         //     this._service._blacklist[blacklistIndex].disabled_user.reason === BlacklistReason.DISABLE
//         // )
//         //     return next(new Forbidden('USER_IS_DISABLED'));

//         // blacklistIndex = this._service._blacklist.findIndex(obj => {
//         //     // user change password
//         //     if (
//         //         obj.disabled_user.id_string === user.id_string &&
//         //         obj.disabled_user.reason !== BlacklistReason.DISABLE &&
//         //         user.token_created_at < obj.issued_at
//         //     )
//         //         return true;

//         //     return false;
//         // });

//         // if (
//         //     blacklistIndex !== -1 &&
//         //     this._service._blacklist[blacklistIndex].disabled_user.reason !== BlacklistReason.DISABLE
//         // )
//         //     return next(new Unauthorized('UNAUTHORIZED'));

//         // if (this._config.env == 'dev' && req.auth.roles && _.includes(req.auth.roles, 'admin')) {
//         //     return next();
//         // }

//         // if (req.auth.roles && _.includes(req.auth.roles, 'guest')) {
//         //     return next();
//         // }

//         const result = this._handler(req.routePath, req.method.toLowerCase(), req.auth.roles);

//         if (result == true) {
//             return next();
//         } else {
//             return next(new Forbidden());
//         }
//     }

//     async getRouteListByRoles(roles: string[]) {
//         return this._permissions
//             .filter(item => {
//                 return _.intersection(item.roles.map(i => i.toString()), roles.map(i => i.toString())).length > 0;
//             })
//             .map(item => {
//                 return { route: item.route, name: item.name };
//             });
//     }
// }

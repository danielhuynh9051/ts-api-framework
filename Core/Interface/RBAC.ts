import { BaseEntity } from 'Core/Database';
import { Role } from '../Database/Models/RBAC/Role';
import { HTTP } from '../Enum';

export interface IPermission {
    readonly name: string;
    readonly path: string;
    readonly method: HTTP;
    readonly roles?: IRole[];
}

export interface IRole {
    readonly name: string;
    readonly description?: string;
    readonly parent_id?: string;
    readonly permissions?: IPermission[];
}

export interface IRoutePath {
    readonly name?: string;
    readonly path: string;
    readonly method: HTTP;
}

export interface IBlackList {
    readonly userId: string;
    readonly userType: string;
    readonly reason: string;
    readonly issuedAt: number;
    readonly expiredAt: number;
}

export interface IUser extends BaseEntity<IUser> {
    readonly id: string | number;
    readonly roles: Role[];
}
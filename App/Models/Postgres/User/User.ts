import { BaseEntity } from 'Core/Database';

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
} from 'typeorm';

import {
    IsEmail
} from 'class-validator';

import { Status } from 'App/Enum/User';
import { Role } from 'Core/Database/Models/RBAC/Role';
import { RBACRole } from 'Core/RBAC';

@Entity()
export class User extends BaseEntity<User> {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    @IsEmail()
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @Column('enum', { enum: Status })
    status: Status;

    @RBACRole
    roles: Role[];
}
import { IRole } from 'Core/Interface/RBAC';
import { BaseEntity } from 'Core/Database';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Permission } from './Permission';
import { Matches } from 'class-validator';
import * as RE from 'Core/RegularExpression';

@Entity()
export class Role extends BaseEntity<Role> implements IRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    @Matches(RE.roleCode, { message: `Role Code must be match ${RE.roleCode.source} pattern` })
    code: string;

    @Column({ nullable: true })
    description: string;

    @Column('uuid', { name: 'parent_id', nullable: true })
    parentId: string;

    @OneToOne(type => Role, role => role.id)
    @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
    parent: Role;

    @ManyToMany(type => Permission, permission => permission.roles, { cascade: ['insert', 'update'] })
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[];
}
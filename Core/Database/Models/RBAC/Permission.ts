import { IPermission } from 'Core/Interface/RBAC';
import { Entity, Index, PrimaryColumn, Column, ManyToMany, JoinTable, BeforeInsert } from "typeorm";
import { BaseEntity } from "Core/Database";
import { HTTP } from "Core/Enum";
import { Role } from "./Role";

@Entity()
@Index(['method', 'path'], { unique: true })
export class Permission extends BaseEntity<Permission> implements IPermission {
    @PrimaryColumn('varchar', { unique: true, update: false })
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    discription: string;

    @Column('enum', { enum: HTTP })
    method: HTTP;

    @Column()
    path: string;

    @ManyToMany(type => Role, role => role.permissions, { cascade: ['insert', 'update'] })
    @JoinTable({
        name: 'role_permission',
        joinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        }
    })
    roles: Role[];

    @BeforeInsert()
    formatId() {
        this.id = `${this.method}|${this.path}`;
    }
}
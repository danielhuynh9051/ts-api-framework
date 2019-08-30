import {
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    BaseEntity as _BaseEntity,
    DeepPartial,
    SaveOptions as _SaveOptions
} from 'typeorm';

export abstract class BaseEntity<TEntity extends _BaseEntity> extends _BaseEntity {

    constructor(data?: DeepPartial<TEntity>) {
        super();

        if (data)
            Object.assign(this, data);
    }

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
    deletedAt: Date;
}
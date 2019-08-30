import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate, Index } from "typeorm";
import { BaseEntity } from 'Core/Database/BaseEntity';
import { IBlackList } from 'Core/Interface';

@Entity('black_list')
export class BlackList extends BaseEntity<BlackList> implements IBlackList {
    @PrimaryColumn('varchar', { unique: true, comment: 'Format <userType>|<userId>' })
    id: string;
    
    @Column('uuid', { name: 'user_id' })
    userId: string;
    
    @Column({ name: 'user_type' })
    @Index('user_type')
    userType: string;

    @Column()
    reason: string;

    @Column({ name: 'issued_at', comment: 'Timestamp' })
    issuedAt: number;

    @Column({ name: 'expired_at' })
    expiredAt: number;

    @BeforeInsert()
    @BeforeUpdate()
    setId() {
        this.id = `${this.userType}|${this.userId}`;
    }
}
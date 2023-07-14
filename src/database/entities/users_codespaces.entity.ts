import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UsersCodespaces {
    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    codespace_id: string

    @Column({ type: 'boolean', default: false })
    codespace_owner: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
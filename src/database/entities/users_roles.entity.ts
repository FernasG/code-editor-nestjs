import { CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UsersRoles {
    @PrimaryColumn()
    user_id: string;

    @PrimaryColumn()
    role_id: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
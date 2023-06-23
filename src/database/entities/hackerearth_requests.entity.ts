import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class HackerearthRequests {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'json', nullable: true })
    queue_response: object;

    @Column({ type: 'json', nullable: true })
    compilation_response: object;

    @Column({ type: 'json', nullable: true })
    execution_response: object;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
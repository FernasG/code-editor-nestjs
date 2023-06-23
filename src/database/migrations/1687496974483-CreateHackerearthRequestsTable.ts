import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateHackerearthRequestsTable1687496974483 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'hackerearth_requests',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isUnique: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid'
                },
                {
                    name: 'queue_response',
                    type: 'json',
                    isNullable: true
                },
                {
                    name: 'compilation_response',
                    type: 'json',
                    isNullable: true
                },
                {
                    name: 'execution_response',
                    type: 'json',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('hackerearth_requests');
    }

}

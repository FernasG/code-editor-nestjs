import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateCodespacesTable1679536398611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'codespaces',
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
                    name: 'name',
                    type: 'varchar',
                    length: '255'
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                    isNullable: true
                },
                {
                    name: 'filename',
                    type: 'varchar',
                    length: '100'
                },
                {
                    name: 'language',
                    type: 'enum',
                    enum: ['python', 'javascript'],
                    enumName: 'lang'
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
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('codespaces');
    }

}

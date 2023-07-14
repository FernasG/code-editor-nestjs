import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateRolesTable1679368666628 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'roles',
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
                    length: '255'
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

        await queryRunner.query('INSERT INTO roles (name, description) VALUES ($1, $2);', ['Admin', 'Administrator']);
        await queryRunner.query('INSERT INTO roles (name, description) VALUES ($1, $2);', ['User', 'User']);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('roles');
    }

}

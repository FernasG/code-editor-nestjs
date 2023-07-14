import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateUsersCodespacesTable1679539663329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users_codespaces',
            columns: [
                {
                    name: 'user_id',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'codespace_id',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'codespace_owner',
                    type: 'boolean',
                    default: false
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
            ],
            foreignKeys: [
                new TableForeignKey({
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'users',
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['codespace_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'codespaces',
                    onDelete: 'CASCADE'
                })
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_codespaces');
    }

}

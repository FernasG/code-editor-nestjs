import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateUsersRolesTable1679368906623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users_roles',
            columns: [
                {
                    name: 'user_id',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'role_id',
                    type: 'uuid',
                    isPrimary: true
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
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                }),
                new TableForeignKey({
                    columnNames: ['role_id'],
                    referencedTableName: 'roles',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                })
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users_roles');
    }

}

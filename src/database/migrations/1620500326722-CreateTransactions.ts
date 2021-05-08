import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from "typeorm";

export default class CreateTransactions1620500326722 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'transactions',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()'
        },

        {
          name: 'category_id',
          type: 'uuid',
          isNullable: false,
        },

        {
          name: 'title',
          type: 'varchar',
          isNullable: false
        },

        {
          name: 'type',
          type: 'varchar',
          isNullable: false
        },

        {
          name: 'value',
          type: 'decimal',
          isNullable: false,
          precision: 10,
          scale: 2
        },

        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },

        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }))

    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      name: 'categoryFk',
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('transactions', 'categoryFk')
    await queryRunner.dropTable('transactions')
  }
}

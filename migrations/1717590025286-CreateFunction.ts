import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFunction1717590025286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create function count_row()
        returns int
        language plpgsql
        as
        $$
            declare
                data_count integer;
            begin
                select count(1)
                into data_count
                from todos;
                
                return data_count;
            end;
            
        $$;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`drop function if exists count_row`);
  }
}

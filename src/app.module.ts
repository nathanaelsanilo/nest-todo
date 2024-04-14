import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: '',
        password: '',
        database: '',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

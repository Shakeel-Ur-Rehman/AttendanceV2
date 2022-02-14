import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SeederService } from './seeder.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    HttpModule,
    TypeOrmModule.forFeature([Employee,Admin,User,File]),
  ],

  providers: [
    SeederService
  ],
})
export class SeederModule {}
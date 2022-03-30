import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([File, Employee, User]), HttpModule],
  controllers: [FileController],
  providers: [FileService, EmployeeService, UsersService, HttpHelperService],
})
export class FileModule {}

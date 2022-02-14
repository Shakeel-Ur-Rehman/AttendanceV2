import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { HttpHelperService } from 'src/helpers/http.helpers';

@Module({
  imports:[TypeOrmModule.forFeature([Employee,User]),HttpModule],
  controllers: [EmployeeController],
  providers: [EmployeeService,UsersService,HttpHelperService]
})
export class EmployeeModule {}

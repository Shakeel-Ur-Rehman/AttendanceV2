import { Module } from '@nestjs/common';
import { GroupPolicyService } from './group-policy.service';
import { GroupPolicyController } from './group-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupPolicy } from './entities/group-policy.entity';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[TypeOrmModule.forFeature([GroupPolicy,Employee,User]),HttpModule],
  controllers: [GroupPolicyController],
  providers: [GroupPolicyService,EmployeeService,UsersService,HttpHelperService]
})
export class GroupPolicyModule {}

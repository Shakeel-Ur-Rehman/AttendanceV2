import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRolesEnum } from 'src/enums/userRole.enum';
import { UserStatusEnum } from 'src/enums/userStatus.enum';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private userService: UsersService,
    private httpService: HttpHelperService,
  ) {}

  create = async (data): Promise<Employee> => {
    data.authUser.type = UserRolesEnum.EMPLOYEE;
    data.authUser.status = UserStatusEnum.INACTIVE;
    const authUser = await this.userService.create(data.authUser);
    const employee = await this.employeeRepo.save({
      authUser,
    });
    return employee;
  };

  findOne(id: number): Promise<Employee> {
    return this.employeeRepo.findOne(id);
  }

  async getEmployeeByBatchNo(batchNo) {
    const employee = await this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoin('authUser', 'user')
      .where('user.username =:username', { username: batchNo })
      .getOne();
    return employee;
  }

  async findMultipleById(data: number[]): Promise<Employee[]> {
    return await this.employeeRepo
      .createQueryBuilder('employee')
      .where('id in (:...ids)', { ids: data })
      .getMany();
  }

  async findByUserId(user_id): Promise<Employee> {
    try {
      const employee = await this.employeeRepo.findOne({
        where: {
          authUserId: user_id,
        },
      });
      await employee.avatar;
      return employee;
    } catch (error) {
      throw new HttpException(
        'Employee details not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async searchEmployees(query) {
    const employees = await this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.authUser', 'user')
      .where('user.username like :username', { username: `${query.query}%` })
      .getMany();
    return employees;
  }

  async update(id, data) {
    const employee = await this.findOne(id);
    Object.keys(data).forEach((key) => {
      employee[`${key}`] = data[`${key}`];
    });
    return this.employeeRepo.save(employee);
  }
}

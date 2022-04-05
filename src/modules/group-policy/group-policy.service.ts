import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeService } from '../employee/employee.service';
import { CreateGroupPolicyDto } from './dto/create-group-policy.dto';
import { UpdateGroupPolicyDto } from './dto/update-group-policy.dto';
import { GroupPolicy } from './entities/group-policy.entity';

@Injectable()
export class GroupPolicyService {
  constructor(
    @InjectRepository(GroupPolicy)
    private readonly groupPolicyRepo: Repository<GroupPolicy>,
    private readonly employeeService: EmployeeService,
  ) {}
  async create(data: CreateGroupPolicyDto, req) {
    const policy = new GroupPolicy();
    Object.keys(data).forEach((key) => {
      policy[`${key}`] = data[`${key}`];
    });
    policy.owner = req.user;
    if (data.employees && data.employees.length > 0) {
      const employees = await this.employeeService.findMultipleById(
        data.employees,
      );
      policy.employees = employees;
    }
    const inserted = await this.groupPolicyRepo.save(policy);
    const new_policy = await this.groupPolicyRepo.findOne(inserted.id, {
      relations: ['employees'],
    });
    return new_policy;
  }

  async findAll() {
    let response = await this.groupPolicyRepo
      .createQueryBuilder('groupPolicy')
      .leftJoin('groupPolicy.owner', 'owner')
      .leftJoin('groupPolicy.employees', 'employees')
      .select([
        'groupPolicy.id',
        'groupPolicy.name',
        'groupPolicy.tags',
        'groupPolicy.checkinTime',
        'groupPolicy.checkoutTime',
        'owner.id',
        'employees.id',
      ])
      .getMany();
    return response;
  }

  async findOne(id: number) {
    const policy = await this.groupPolicyRepo.findOne(
      { id: id },
      { relations: ['employees', 'employees.authUser'] },
    );
    if (!policy) {
      throw new HttpException(
        `GroupPolicy does not exist against this id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return policy;
  }

  async update(id: number, data: UpdateGroupPolicyDto) {
    const policy = await this.findOne(id);
    Object.keys(data).forEach((key) => {
      policy[`${key}`] = data[`${key}`];
    });
    if (
      (data.employees && data.employees.length > 0) ||
      policy.employees.length > 0
    ) {
      if (data.employees.length == 0) {
        policy.employees = [];
      } else {
        const employees = await this.employeeService.findMultipleById(
          data.employees,
        );
        policy.employees = employees;
      }
    }
    await this.groupPolicyRepo.save(policy);
    const new_policy = this.groupPolicyRepo.findOne(id, {
      relations: ['employees', 'employees.authUser'],
    });
    return new_policy;
  }

  async remove(id: number) {
    try {
      const policy = await this.findOne(id);
      return await this.groupPolicyRepo.delete(policy);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

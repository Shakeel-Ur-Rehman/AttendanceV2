import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { HttpHelperService } from 'src/helpers/http.helpers';

@ApiBasicAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly httpService: HttpHelperService,
  ) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, data) {
    return this.employeeService.update(+id, data);
  }

  @Get('/:badgeNo')
  async getByBadgeNo(@Param('badgeNo') badgeNo: number) {
    const employee = await this.employeeService.getEmployeeByBatchNo(badgeNo);
    let res = {};
    if (process.env.IS_SYNC) {
      res = await this.httpService.getEmployeeDetails(badgeNo);
      if (!res) {
        throw new HttpException(
          { message: 'Invalid Badge No' },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // TODO: save the details
      }
    }
    return {
      data: [{ user: employee, almanaUser: res || {} }],
      total: 1,
    };
  }
}

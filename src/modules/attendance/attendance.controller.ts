import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckoutDto, CreateAttendanceWithQRCodeDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@ApiBearerAuth()
@ApiTags("Attendance")
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin-with-qrCode')
  async create(
    @Body() data: CreateAttendanceWithQRCodeDto,
    @Request() req,
  ) {
    return await this.attendanceService.create(data,req)
  }

  @Get()
  findAll(): Promise<Attendance[]> {
    return this.attendanceService.findAll();
  }

  @Get('with-data/:take/:skip')
  async findAllWithData(
    @Param('take',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    take: number,

    @Param('skip',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    skip: number,
    @Request() req,
  ) {
    // #TODO: implement role based auth
    this.attendanceService.findPaginated(skip,take)
  }

  @Get(':id')
  findOne(@Param(
    'id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number) {
    return this.attendanceService.findOne(id);
  }

  @Get('/generate_csv')
  async generateCSV() {
    return this.attendanceService.genearte_csv()
  }

  @Patch('check-out/:id')
  public async checkout(
    @Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    @Body() body: CheckoutDto,
    @Request() req,
  ): Promise<Attendance> {
    return this.attendanceService.checkOut(id,body,req)
  }

}

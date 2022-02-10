import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { LocationService } from 'src/modules/location/location.service';
import { Location } from 'src/modules/location/entities/location.entity';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[TypeOrmModule.forFeature([Attendance,Location]),HttpModule],
  controllers: [AttendanceController],
  providers: [AttendanceService,LocationService,HttpHelperService]
})
export class AttendanceModule {}

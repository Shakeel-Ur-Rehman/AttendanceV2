import {  HttpException, HttpStatus, Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationService } from 'src/modules/location/location.service';
import { Repository } from 'typeorm';
import { AttendanceHelpers } from './attendance.helpers';
import { Attendance } from './entities/attendance.entity';
import * as moment from "moment"
import {HttpHelperService} from "../../helpers/http.helpers"
import { AppHelpers } from 'src/helpers/app.helpers';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attedanceRepo:Repository<Attendance>,
    private readonly locationService:LocationService,
    private httpHelperService:HttpHelperService
  ){}
  async create(data:any,@Request() req) {
    const employee = await req.user.employee
    const todaysAttendances = await this.getTodaysAttendances(employee.id)
    AttendanceHelpers.handleAllowedCheckins(employee,todaysAttendances,data)
    AttendanceHelpers.matchLocation(data,await this.locationService.findByIds(data.locationId))
    return this.checkIn(employee,todaysAttendances,data,location)
  }

  findAll() :Promise<Attendance[]>{
    return this.attedanceRepo.find({where:{ is_archived: false }});
  }

  async findOne(id:number)
   {
     const repo = await this.attedanceRepo.findOne(id)
     if(!repo){
       throw new HttpException("not found",HttpStatus.BAD_REQUEST)
     }
     return repo
   }


   async getTodaysAttendances(employeeId){
     return  this.attedanceRepo.find({where:{employeeId}})
   }

   async checkIn(employee, todaysAttendances, data, location) {
     let res = {}
    let { checkInTime } = AttendanceHelpers.checkPolicy(employee);
    checkInTime = data.currentTime ? data.currentTime : checkInTime;
    // handle same minute logic and if the current checkin is in same minute throw an error
    AttendanceHelpers.checkSameMinuteCheckIn(todaysAttendances,checkInTime)

    if (process.env.IS_SYNC && todaysAttendances.length == 0) {
      res = await this.httpHelperService.createCheckIn({username:employee.authUser.username, location, checkInTime});
      // save checkin row id of the user
    } else if (todaysAttendances.length >= 1 && process.env.IS_SYNC) {
      const request = {
        AttendanceId: parseInt(employee.checkInRowId),
        S2TimeIn: moment(checkInTime).format().split('+')[0].trim(),
        Shift: 'S2',
        Time: 'In',
        EmpNo: parseInt(employee.authUser.username),
      };
      res = await this.httpHelperService.updateCheckOut(request, location);
    }
    
    const attendance = await this.createWithQRCode({
      deviceId: data.deviceId,
      qrCode: data.qrCode,
      locationId: location.id,
      employee,
      checkInTime,
      isNightShiftLogin: data.currentTime ? true : false,
      checkInType: data.checkInType,
      checkInFace: data.checkInFace,
    });
    return { attendance, res };
    }

    async checkOut(id:number,body:any,req:any){
      const employee = await req.user.employee
      const existingAttendance = await this.findOne(id)
      const location = AttendanceHelpers.checkoutLogic(
      existingAttendance,
      employee,
      body,
      await this.locationService.findByQRCode(body.qr_code)
    );
      let { checkoutTime } = AttendanceHelpers.checkPolicy(employee);
      checkoutTime = body.currentTime ? body.currentTime : checkoutTime;
    return existingAttendance
    }




    async createWithQRCode (data): Promise<Attendance> {
      const attendance = await this.attedanceRepo.save({
        checkin_time: data.checkInTime,
        is_night_shift: data.isNightShiftLogin,
        locationId: data.locationId,
        qr_code: data.qrCode,
        employee: data.employee,
        checkin_device_id: data.deviceId,
        checkInId: data.checkInId ? data.checkInId : data.employee.checkInRowId,
        checkInType: data.checkInType,
        checkInFace: data.checkInFace,
      });
      return attendance;
    };


    async genearte_csv(){
      try {
        let result = await this.createQueryBuilder()
          .select([
            'Attendance.id',
            'Attendance.checkInTime',
            'Attendance.checkoutTime',
            'location.name',
            'checkoutLocation.name',
            'employee.id',
            'authUser.initialData',
          ])
          .orderBy('Attendance.id', 'DESC')
          .getMany();
        return await AppHelpers.generateCSV(result);
      } catch (err) {
        throw new HttpException(`${err.message}`, HttpStatus.BAD_REQUEST);
      }
    }


    async findPaginated(skip:number,take:number){
      const total = await this.attedanceRepo.count({});
      const result = await this.createQueryBuilder()
        .orderBy('Attendance.id', 'DESC')
        .skip(skip)
        .take(take)
        .getMany();
      return { result, total };
    }
 
    private createQueryBuilder(){
        return this.attedanceRepo
        .createQueryBuilder('Attendance')
        .where('Attendance.isArchived = false')
        .leftJoinAndSelect('Attendance.employee', 'employee')
        .leftJoinAndSelect('employee.authUser', 'authUser')
        .leftJoinAndSelect('Attendance.location', 'location')
        .leftJoinAndSelect('Attendance.checkoutLocation', 'checkoutLocation')
    }
}


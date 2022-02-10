import { HttpException, HttpStatus } from "@nestjs/common";
import { AttendanceType } from "src/enums/attendanceType.enum";
import { AppHelpers } from "src/helpers/app.helpers";
import * as moment from "moment"

export class AttendanceHelpers{
    static  handleAllowedCheckins(employee, todaysAttendances, data) {
        if (
          employee.attendanceType === AttendanceType.SINGLE &&
          todaysAttendances.length
        ) {
          throw new HttpException(
            `You're not allowed to check in more than once in a day.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      
        if (
          employee.attendanceType === AttendanceType.DOUBLE &&
          todaysAttendances.length >= 2
        ) {
          throw new HttpException(
            `You're not allowed to check in more than twice in a day.`,
            HttpStatus.BAD_REQUEST,
          );
        }
      
        if (employee.isMac) {
          const mac_address: string = data.qrCode.split(':')[0];
          if (employee.macAddress != mac_address) {
            throw new HttpException(
              `Please Check In Using the authenitcated device`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

    static matchLocation(data,allLocations) {        
        var location: any = allLocations.filter(
          (location) => location.qrCode === data.qrCode,
        );
        if (location.length == 0) {
          throw new HttpException(
            `Location By QR code does not match with location by id`,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          location = location[0];
        }
        return location;
    }

    static checkPolicy(employee){
        var checkInTime = AppHelpers.getCurrentDateTime()
        var checkoutTime = AppHelpers.getCurrentDateTime()
        // this time will be in 24 hours format
    
        if (employee.group) {
          const checkin = compareCheckIn(employee.group.checkinTime);
          const checkout = compareCheckOut(employee.group.checkoutTime);
          if (checkin.response) {
            checkInTime = setDateTime(checkin);
          }
    
          if (checkout.response) {
            checkoutTime = setDateTime(checkout);
          }
        }
        return { checkInTime, checkoutTime };
    };

    static checkSameMinuteCheckIn(attendances,checkInTime){
        const sorted = attendances.sort((a, b) => {
            a - b;
          });
          const todaysLastAttendance = sorted[sorted.length - 1];
          if (
            todaysLastAttendance &&
            moment(checkInTime).isSame(
              moment(todaysLastAttendance.checkInTime),
              'minute',
            )
          ) {
            throw new HttpException(
              {
                message: `2 checkins within the same minute/time is not allowed`,
              },
              HttpStatus.BAD_REQUEST,
            );
        }
    }

    static checkoutLogic(existingAttendance, employee, body,locationByQRCode){
        if (!existingAttendance) {
            throw new HttpException(
              `Attendance does not exist against the provided id`,
              HttpStatus.NOT_FOUND,
            );
          }
          if (employee.isMac) {
            const mac_address: string = body.qrCode.split(':')[0];
            if (mac_address !== employee.macAddress) {
              throw new HttpException(
                `Please Use Authenticated Device To LogOut`,
                HttpStatus.NOT_FOUND,
              );
            }
          }
          if (!locationByQRCode) {
            throw new HttpException(
              `Location does not exist against this qr code :${body.qrCode}`,
              HttpStatus.NOT_FOUND,
            );
          }
          const location = employee.locations.find(
            (location) => locationByQRCode.id === location.id,
          );
          if (location == undefined) {
            throw new HttpException(
              `Location By QR code does not match with location by id`,
              HttpStatus.BAD_REQUEST,
            );
          }
          return location;
    }

}




function compareCheckOut(param) {
    const time = param.split(':');
    const currentTime = new Date(AppHelpers.getCurrentDateTime());
    var response = false;
    if (
      currentTime.getHours() > time[0] ||
      (time[0] == currentTime.getHours() && currentTime.getMinutes() >= time[1])
    ) {
      response = true;
    }
    return { response, time };
}
  
function compareCheckIn(param) {
    const time = param.split(':');
    const currentTime = new Date(AppHelpers.getCurrentDateTime());
    var response = false;
    if (
      currentTime.getHours() < time[0] ||
      (time[0] == currentTime.getHours() && currentTime.getMinutes() <= time[1])
    ) {
      response = true;
    }
    return { response, time };
}


function setDateTime(params) {
    let newDateTime = new Date(AppHelpers.getCurrentDateTime());
    newDateTime = new Date(newDateTime.setHours(params.time[0]));
    newDateTime = new Date(newDateTime.setMinutes(params.time[1]));
    newDateTime = new Date(newDateTime.setSeconds(0));
    return moment(newDateTime).format('YYYY-MM-DD HH:mm:ss');
  }
  
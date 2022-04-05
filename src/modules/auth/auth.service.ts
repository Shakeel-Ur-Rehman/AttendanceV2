import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRolesEnum } from 'src/enums/userRole.enum';
import { AppHelpers } from 'src/helpers/app.helpers';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';
import { VersionManagerService } from '../version-manager/version-manager.service';
import { AuthHelpers } from './auth.helpers';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private versionManagerService: VersionManagerService,
    private httpService: HttpHelperService,
    private adminService: AdminService,
  ) {}

  async login(body: SignInDto) {
    const user = await this.usersService.findByUserName(body.username);
    if (!user) {
      throw new HttpException(
        'invalid username to passord',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const activeVersion = await this.versionManagerService.findActiveVersion();

    AuthHelpers.checkActiveVersion(body, activeVersion);
    await this.registerDevice(user, body);
    await this.checkHRMDetails(user);
    return {
      access_token: this.jwtService.sign({ username: user.username }),
      role: user.type,
    };
  }

  async getLoggedUserDetails(user) {
    let me = null;
    if (
      user &&
      (user.type === 'admin' ||
        user.type === 'manager' ||
        user.type === 'supervisor')
    ) {
      me = await this.adminService.findOne(user.id);
    } else if (user && user.type === 'employee') {
      const employee = await user.employee;
      const attendances = await employee.attendances;
      me = employee;
      const sort = attendances.sort((a, b) => a.id - b.id);
      const last_attendnace = sort[sort.length - 1];
      me['isNightShiftLogin'] = last_attendnace
        ? last_attendnace.isNightShiftLogin
        : false;
      attendances.sort(AppHelpers.getDateTimeSorter('checkInTime'));
    }
    return me;
  }

  async registerDevice(user, data) {
    if (user.device_id == null) {
      try {
        await this.usersService.update(user.id, {
          device_id: data.deviceId,
          device_type: data.deviceType,
        });
      } catch (error) {
        const user = await this.usersService.findOneByCondition({
          device_id: data.device_id,
        });
        throw new HttpException(
          {
            message: `This device is already registered against user ${user.username}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (
      user.device_id !== data.deviceId &&
      user.type !== UserRolesEnum.ADMIN &&
      user.type !== UserRolesEnum.MANAGER &&
      !user.multiDevice
    ) {
      throw new HttpException(
        { message: `Please Login From registered device` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkHRMDetails(user) {
    if (user.type === UserRolesEnum.EMPLOYEE && process.env.IS_SYNC) {
      const res = await this.httpService.getEmployeeDetails(user.user_name);
      if (!res) {
        throw new HttpException(
          { message: `Invalid Batch number.` },
          HttpStatus.NOT_FOUND,
        );
      }
      // set basic data and statuses

      // check for the active statuses
      AuthHelpers.checkUserHRMStatus(user);
    }
  }
}

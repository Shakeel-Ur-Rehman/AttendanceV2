import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRolesEnum } from 'src/enums/userRole.enum';
import { UserStatusEnum } from 'src/enums/userStatus.enum';

export const validUserStatus = [
  UserStatusEnum.ACTIVE,
  UserStatusEnum.HOLD,
  UserStatusEnum.VACATION,
  UserStatusEnum.RESIGNED,
  UserStatusEnum.TERMINATED,
];

export class AuthHelpers {
  static checkActiveVersion(data, activeVersion) {
    if (data.deviceType == 'web') {
    } else {
      const version_matched = checkVersion(
        data.version,
        activeVersion,
        data.deviceType,
      );
      if (!version_matched) {
        if (data.deviceType === 'ios') {
          if (data.osVersion) {
            if (parseInt(data.osVersion) > 12) {
              throw new HttpException(
                `1. Open the App Store.\n2. Tap your profile icon at the top of the screen.\n3. Scroll to see pending updates.\n4. Tap Update next to AGH-TAA app to update.`,
                HttpStatus.BAD_REQUEST,
              );
            } else {
              throw new HttpException(
                `1. Open the App Store.\n2. Tap updates icon at the bottom of the screen.\n3. Scroll to see pending updates.\n4. Tap Update next to AGH-TAA app to update.`,
                HttpStatus.BAD_REQUEST,
              );
            }
          } else {
            throw new HttpException(
              `1. Open the App Store. 2. Tap your profile icon at the top of the screen. 3. Scroll to see pending updates. 4. Tap Update next to AGH-TAA app to update. OR 1. Open the App Store. 2. Tap updates icon at the bottom of the screen .3. Scroll to see pending updates. 4. Tap Update next to AGH-TAA app to update.`,
              HttpStatus.BAD_REQUEST,
            );
          }
        } else if (data.deviceType === 'android') {
          throw new HttpException(
            'App update is available on Store. Kindly update your App from respective store to get latest features.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  static checkUserHRMStatus(user) {
    var expired = false;
    if (
      user.status === UserStatusEnum.RESIGNED ||
      user.status === UserStatusEnum.TERMINATED
    ) {
      const initialData = JSON.parse(user.initialData);
      const lastWorkingDate = Date.parse(initialData['lastWorkingDate']);
      const currentDate = new Date().getTime();
      if (isNaN(lastWorkingDate) || lastWorkingDate < currentDate) {
        expired = true;
      }
    }
    if (
      (!validUserStatus.includes(user.status) &&
        user.type === UserRolesEnum.EMPLOYEE) ||
      expired
    ) {
      throw new HttpException(
        {
          message: `Employee is no more active contact to HRM`,
          status: user.status,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

function checkVersion(appVersion, responseVersion, deviceType) {
  if (!appVersion) {
    return false;
  }
  responseVersion =
    deviceType == 'android'
      ? responseVersion.android_version
      : responseVersion.ios_version;
  const currentVersion = appVersion.split('.');
  const newVersion = responseVersion.split('.');
  if (parseInt(currentVersion[0]) < parseInt(newVersion[0])) {
    return false;
  } else if (parseInt(currentVersion[1]) < parseInt(newVersion[1])) {
    return false;
  } else {
    return true;
  }
}

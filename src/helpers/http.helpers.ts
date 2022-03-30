import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

const ALMANA_BACKEND_BASE_URL = process.env.ALMANA_BACKEND_BASE_URL;

@Injectable()
export class HttpHelperService {
  constructor(private readonly httpService: HttpService) {}

  async getEmployeeDetails(employeeId) {
    const url = `Accounts/Users/GetEmployeeDetails/${employeeId}`;
    return await this.getRequest(url);
  }

  async updateCheckOut(data, location, location_params = {}) {
    if (location && data.Time != 'Both') {
      location_params[`LocationName`] = location.name.slice(0, 45);
      location_params[`Time${data.Time}Longitudes`] = parseFloat(location.long);
      location_params[`Time${data.Time}Latitudes`] = parseFloat(location.lat);
    }
    const url = 'Attendance/UpdateCheckOut/';
    return this.postRequest(url, {
      ...data,
      ...location_params,
    });
  }

  async createCheckIn(body) {
    const url = `${ALMANA_BACKEND_BASE_URL}Attendance/AddCheckIn/${
      body.username
    }/${body.checkInTime}/${body.location.name.slice(0, 45)}/${
      body.location.long
    }/${body.location.lat}/`;
    return await this.postRequest(url, {});
  }

  private async getRequest(url) {
    try {
      const res = this.httpService
        .get(`${ALMANA_BACKEND_BASE_URL}${url}`)
        .pipe(map((response) => response.data));
      return await lastValueFrom(res);
    } catch (error) {
      console.log('there is some error');
    }
  }

  private async postRequest(url, data) {
    try {
      const res = this.httpService
        .post(`${ALMANA_BACKEND_BASE_URL}${url}`, data)
        .pipe(map((response) => response.data));
      return await lastValueFrom(res);
    } catch (error) {
      console.log('there is some error');
    }
  }
}

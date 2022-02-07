import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom, map } from "rxjs";

const ALMANA_BACKEND_BASE_URL = process.env.ALMANA_BACKEND_BASE_URL


@Injectable()
export class HttpHelpers{
    constructor(
        private readonly httpService: HttpService,
    ){}

    async getEmployeeDetails(employeeId){
        const url = `Accounts/Users/GetEmployeeDetails/${employeeId}`
        return await this.getRequest(url)
    }

    async createCheckIn(body){
        const url =`${ALMANA_BACKEND_BASE_URL}Attendance/AddCheckIn/${
            body.username
          }/${body.checkInTime}/${body.location.name.slice(0, 45)}/${body.location.long}/${
            body.location.lat
          }/`
        return await this.postRequest(url)
    }

   async getRequest(url){
        try{
           const res = this.httpService.get(`${ALMANA_BACKEND_BASE_URL}${url}`)
                       .pipe(map(response => response.data))
           return await lastValueFrom(res);
        }
        catch(error){
        console.log("there is some error")
        }
    }


    async postRequest(url){
        try{
            const res = this.httpService.get(`${ALMANA_BACKEND_BASE_URL}${url}`)
                        .pipe(map(response => response.data))
            return await lastValueFrom(res);
         }
         catch(error){
         console.log("there is some error")
         }
    }
}
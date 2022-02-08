const moment = require('moment');
const ZERO_DATE = '0001-01-01T09:00:00.000Z';
const path = require('path');

export class AppHelpers{

    static getDateTimeSorter = (property) => (a, b) => {
        const first = a[property] || ZERO_DATE;
        const second = b[property] || ZERO_DATE;
        return moment(first).diff(moment(second));
      };
    
      static getCurrentDateTime = () => {
        const d = new Date();
        const local = d.getTime();
        const offset = d.getTimezoneOffset() * (60 * 1000);
        const utc = new Date(local + offset);
        const riyadh = new Date(utc.getTime() + 3 * 60 * 60 * 1000);
        return moment(riyadh.toLocaleString()).format('YYYY-MM-DD HH:mm:ss');
      };
    

}
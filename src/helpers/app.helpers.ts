const moment = require('moment');
const ZERO_DATE = '0001-01-01T09:00:00.000Z';
const ObjectsToCsv = require('objects-to-csv');

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
    
    
      static async generateCSV(data){
        const items = [];
        data.forEach((item) => {
          const initialData = item.employee
            ? JSON.parse(item?.employee?.authUser?.initialData)
            : {};
          items.push({
            'Attendance Id': item.id,
            'Employee No': initialData ? initialData['Employee No'] : '',
            'Employee Name': initialData['Name'] || '',
            'Check-in Time': item.checkInTime,
            'CheckOut Time': item.checkoutTime,
            'Check-in Location': item.location.name,
            'CheckOut Location': item.checkoutLocation
              ? item.checkoutLocation.name
              : item.location.name,
          });
        });
        const loopIteration = Math.ceil(items.length / 50000);
        const file_name = `${new Date().getTime()}.csv`;
        for (const index of Array.from({ length: loopIteration }, (v, i) => i)) {
          let start = index == 0 ? 0 : index * 50000 + 1;
          let end = (index + 1) * 50000;
          let item = items.slice(start, end);
          if (index == 0) {
            await new ObjectsToCsv(item).toDisk(`./public/${file_name}`);
          } else {
            await new ObjectsToCsv(item).toDisk(`./public/${file_name}`, {
              append: true,
            });
          }
        }
        return file_name;
      }

      static async sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
}
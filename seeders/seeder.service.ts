import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadHelpers } from 'src/helpers/file-upload.helpers';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as fs from "fs"
import * as path from "path"

@Injectable()
export class SeederService {
  constructor(
      @InjectRepository(Employee)
      private readonly employeeRepo:Repository<Employee>
  ) {}


  /**
   * if you want to upload the files from your instance local to s3
   */
  async uploadProfilePicture() {
    const employees = await this.employeeRepo.find({
      where: {
        avatarId: Not(IsNull()),
      },
    });
    for (const employee of employees) {
      const file = path.join(__dirname, '../../../', employee.avatar.url);
      const res = FileUploadHelpers.uploadToS3(   {
        buffer: fs.readFileSync(file),
        originalname: employee.avatar.name,
      },
      'userProfiles')
      // #TODO: save the key in the database

      //await this.fileService.updateKey(res.Key, employee.avatar.id);
    }
  }

}
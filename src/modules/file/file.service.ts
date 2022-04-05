import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { FileUploadHelpers } from 'src/helpers/file-upload.helpers';
import { EmployeeService } from '../employee/employee.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    private readonly employeeService: EmployeeService,
  ) {}

  async create(file, user) {
    const employee = await this.employeeService.findByUserId(user.id);
    if (employee.avatar) {
      await fs.unlinkSync(
        path.join(__dirname, '../../../', `/${employee.avatar.url}`),
      );
    }
    const file_path = path.join(
      __dirname,
      `../../../public/uploads`,
      `${new Date().getTime()}.${file.originalname.split('.')[1]}`,
    );
    await fs.writeFileSync(file_path, file.buffer, 'base64');
    const uploadResult = await FileUploadHelpers.uploadToS3(
      file,
      'userProfiles',
    );
    const res = await this.fileRepo.save({
      name: file.originalname,
      url: file_path.split('attendance-backend/')[1],
      key: uploadResult['Key'],
    });
    employee.avatar = res;
    // #TODO: update the employee avatar
    //this.employeeService.update(employee.id,res);
    return res;
  }

  async findOne(id: number): Promise<File> {
    return this.fileRepo.findOne(id);
  }

  async remove(id: number) {
    const file: File = await this.fileRepo.findOne(id);
    if (file) {
      await FileUploadHelpers.deleteFileFromS3(file.key);
      return this.fileRepo.delete(file.id);
    }
  }

  async updateKey(key, id) {
    const file = await this.fileRepo.findOne(id);
    file.key = key;
    this.fileRepo.save(file);
  }
}

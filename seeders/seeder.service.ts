import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadHelpers } from 'src/helpers/file-upload.helpers';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { getConnection, getManager, IsNull, Not, Repository } from 'typeorm';
import * as fs from "fs"
import * as path from "path"
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRolesEnum } from 'src/enums/userRole.enum';
import * as bcrypt from 'bcrypt';
import  employeesData from "./data/employees"
import { UserStatusEnum } from 'src/enums/userStatus.enum';

@Injectable()
export class SeederService {
  constructor(
      @InjectRepository(Employee)
      private readonly employeeRepo:Repository<Employee>,

      @InjectRepository(Admin)
      private readonly adminRepo:Repository<Admin>,

      @InjectRepository(User)
      private readonly userRepo:Repository<User>
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


  async seedAdmin(){
    const admin = await this.userRepo.findOne({where:{
      username:'admin'
    }})
    if(admin){
      console.log("An Admin Already exists with the username admin")
    }
    else{
      const user = await this.userRepo.save({
        username:"admin",
        password:await bcrypt.hash('admin123',10),
        type:UserRolesEnum.ADMIN,
        status:UserStatusEnum.ACTIVE,
        initial_data:{}
      })
      const admin = new Admin()
      admin.authUser = user
      await this.adminRepo.save(admin)
      console.log("Admin Seeded Successfully")
    }
  }



  async seedEmployees(){
    const users: User[] = [];
    const employees = [];
    console.log("seedign employees")
    let i =0

    for (const item of employeesData) {
      users.push({
        username:item['Employee No'],
        password:await bcrypt.hash('12345',10),
        status: item['Status'] as UserStatusEnum,
        type:UserRolesEnum.EMPLOYEE,
        initial_data:{}
      } as User)
      console.log(i)
      i++

    }
    console.log("gettign connection")
    const dbUsers = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();

    dbUsers.raw.forEach((item) =>
      employees.push({
        attendanceRadius: 100,
        authUser: item,
      }),
    );

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Employee)
      .values(employees)
      .execute();
      console.log("seeding completed")
  }

  async truncateEmployees(){
    const entityManager = getManager();
    entityManager.query(
      `
      TRUNCATE TABLE "admin" CASCADE;
      TRUNCATE TABLE "users" CASCADE;
      TRUNCATE TABLE "employees" CASCADE;
      TRUNCATE TABLE "locations" CASCADE;
      TRUNCATE TABLE "attendances" CASCADE;
      TRUNCATE TABLE "employee_locations_location" CASCADE;
    `,
      [],
    );
  }

  async seedVersion(){
    
  }
}
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatusEnum } from 'src/enums/userStatus.enum';
import { AppHelpers } from 'src/helpers/app.helpers';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo:Repository<Admin>,
    private readonly userService:UsersService
  ){}
  async create(data: CreateAdminDto,secret:string) {
    try{
      AppHelpers.checkSecret(secret)
      data.authUser['status'] = UserStatusEnum.ACTIVE;
    const authUser = await this.userService.create({
      ...data.authUser,
      username: data.authUser.username.toLowerCase(),
    });
    const admin = await this.adminRepo.save({
      authUser,
    });
    return admin;
    }
    catch(error){
      throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
    }
    
  }

  findAll() {
    return this.adminRepo.find()
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOne({ id });
    if(!admin){
      throw new HttpException("Admin Not Found",HttpStatus.BAD_REQUEST)
    }
    return admin
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  async remove(id: number,req) {
    const admin = await this.adminRepo.findOne(id, { relations: ['authUser'] });
    if (admin) {
      if (admin.authUser.id === req.user.id) {
        throw new BadRequestException("You can't delete yourself");
      }
    return this.adminRepo.delete(admin);
  }
 }
}

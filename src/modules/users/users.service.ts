import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>
  ){}

    async findByUserName(username: string): Promise<User | undefined> {
        const user = await this.userRepo.findOne({where:{username:username}});
        if (!user){
          throw new HttpException("invalid username",HttpStatus.BAD_REQUEST)
        }
        return user
    }


    async findOneByCondition(condition){
      const user = await this.userRepo.findOne({where:{...condition}})
      if(!user){
        throw new HttpException("Not Found",HttpStatus.BAD_REQUEST)
      }
      return user
    }

    async create(data){
      data.password = await bcrypt.hash(data.password,10)
      return this.userRepo.save(data).catch((e) => {
        if (/(username)[\s\S]+(already exists)/.test(e.detail)) {
          throw new BadRequestException(
            'Account with this username already exists.',
          );
        }
        return e;
      });
    }


    async update(id,data){
        const user = await this.findOneByCondition({id:id})
        Object.keys(data).forEach((key)=>{
          user[`${key}`] = data[`${key}`]
        })
        await this.userRepo.save(user)
        return user
    }
}

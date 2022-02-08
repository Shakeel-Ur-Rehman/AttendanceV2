import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>
  ){}

    async findOne(username: string): Promise<User | undefined> {
        return this.userRepo.findOne({where:{username:username}});
    }


    async create(data){
      return this.userRepo.save(data).catch((e) => {
        if (/(username)[\s\S]+(already exists)/.test(e.detail)) {
          throw new BadRequestException(
            'Account with this username already exists.',
          );
        }
        return e;
      });
    }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(body: SignInDto) {
        const user = await this.usersService.findOne(body.username);
        if (user && user.password === body.password) {
          const { password, ...result } = user;
          return {
              token:this.jwtService.sign({...result})
          }
        }
        else{
            throw new HttpException("invalid username to passord",HttpStatus.UNAUTHORIZED)
        } 
      }

    async getLoggedUserDetails(user){
        let me = null;
        return me;
    }
}

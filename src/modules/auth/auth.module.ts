import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { VersionManagerService } from '../version-manager/version-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionManager } from '../version-manager/entities/version-manager.entity';
import { HttpHelperService } from 'src/helpers/http.helpers';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/entities/admin.entity';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([VersionManager, Admin]),
    UsersModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    VersionManagerService,
    HttpHelperService,
    AdminService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

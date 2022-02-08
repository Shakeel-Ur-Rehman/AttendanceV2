import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { EmployeeModule } from '../employee/employee.module';
import { VersionManagerModule } from '../version-manager/version-manager.module';
import { FileModule } from '../file/file.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(join(__dirname, '../../', 'uploads')),
    }),
    AuthModule,
    AdminModule,
    EmployeeModule,
    VersionManagerModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

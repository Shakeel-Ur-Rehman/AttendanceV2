import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { LocationModule } from 'src/modules/location/location.module';
import { LoggerMiddleware } from 'src/middelewares/logger.middleware';
import { AttendanceModule } from 'src/modules/attendance/attendance.module';
import { GroupPolicyModule } from '../group-policy/group-policy.module';
import { RolesGuard } from 'src/guards/role.guard';


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
    FileModule,
    LocationModule,
    AttendanceModule,
    GroupPolicyModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionManager } from './entities/version-manager.entity';
import { VersionManageController } from './version-manager.controller';
import { VersionManagerService } from './version-manager.service';

@Module({
  imports:[TypeOrmModule.forFeature([VersionManager])],
  controllers: [VersionManageController],
  providers: [VersionManagerService]
})
export class VersionManagerModule {}

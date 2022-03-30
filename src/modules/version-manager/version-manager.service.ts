import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionManager } from './entities/version-manager.entity';

@Injectable()
export class VersionManagerService {
  constructor(
    @InjectRepository(VersionManager)
    private readonly versionManagerRepo: Repository<VersionManager>,
  ) {}

  async create(data) {
    try {
      const versionManager = new VersionManager();
      versionManager.ios_version = data.iosVersion;
      versionManager.android_version = data.androidVersion;
      versionManager.is_active = true;
      const activeVersion = await this.findActiveVersion();
      if (activeVersion) {
        activeVersion.is_active = false;
        await this.versionManagerRepo.save(activeVersion);
      }
      const response = await this.versionManagerRepo.save(versionManager);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: number): Promise<VersionManager> {
    return this.versionManagerRepo.findOne(id);
  }

  async findActiveVersion(): Promise<VersionManager> {
    return await this.versionManagerRepo.findOne({ is_active: true });
  }
}

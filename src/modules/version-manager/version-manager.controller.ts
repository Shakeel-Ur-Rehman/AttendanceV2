import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { VersionManager } from './entities/version-manager.entity';
import { VersionManagerService } from './version-manager.service';
import { NoAuth } from 'src/guards/no-auth.guard';
import { createVersionManagerDto } from './dto/create-version-manager.dto';

@Controller('versionManager')
@ApiTags('VersionManager  ')
export class VersionManageController {
  constructor(
    private readonly versionManagerService: VersionManagerService,
    @InjectRepository(VersionManager)
    private readonly versionManagerRepo: Repository<VersionManager>,
  ) {}

  @NoAuth()
  @ApiOperation({ summary: 'Add a new app version' })
  @ApiResponse({ type: VersionManager, status: 201 })
  @Post()
  @UsePipes(ValidationPipe)
  public async create(@Body() data: createVersionManagerDto, @Request() req) {
    try {
      const versionManager = new VersionManager();
      versionManager.ios_version = data.iosVersion;
      versionManager.android_version = data.androidVersion;
      versionManager.is_active = true;
      const activeVersion = await this.versionManagerService.findActiveVersion();
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


  @NoAuth()
  @ApiOperation({ summary: 'Get Active Version of Apps' })
  @ApiResponse({ type: VersionManager, status: 201 })
  @Get('/get-active-version')
  @UsePipes(ValidationPipe)
  public async getActive(@Request() req) {
    try {
      const response = await this.versionManagerService.findActiveVersion();
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

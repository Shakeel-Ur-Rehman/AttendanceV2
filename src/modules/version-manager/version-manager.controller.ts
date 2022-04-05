import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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

@ApiBearerAuth()
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
  public async create(@Body() data: createVersionManagerDto) {
    return this.versionManagerService.create(data);
  }

  @NoAuth()
  @ApiOperation({ summary: 'Get Active Version of Apps' })
  @ApiResponse({ type: VersionManager, status: 201 })
  @Get('/get-active-version')
  public async getActive(@Request() req) {
    try {
      const response = await this.versionManagerService.findActiveVersion();
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}

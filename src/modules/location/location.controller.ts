import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, Request, HttpException } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  public async create(
    @Body() data: CreateLocationDto,
  ): Promise<Location> {
    // #TODO:  implement role based authorization only admin can use this api
    return this.locationService.create({ ...data });
  }

  @Get()
  findAll():Promise<Location[]> {
    return this.locationService.findAll();
  }

  @Get(':id')
  public async findOne(
    @Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<Location> {
   return this.locationService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(
    @Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) 
    id: string) {
    // #TODO:  implement role based authorization only admin can use this api
    return this.locationService.remove(+id);
  }
}

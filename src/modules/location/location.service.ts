import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return this.locationRepo.save(createLocationDto);
  }

  findAll() {
    return this.locationRepo.find();
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepo.findOne({ id });
    if (!location) {
      throw new HttpException(
        `Location does not exist against this id :${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {}

  async findByIds(ids: number[]): Promise<Location[]> {
    const res = await this.locationRepo
      .createQueryBuilder('location')
      .where('location.id IN (:...ids)', { ids: ids })
      .getMany();
    return res;
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    return this.locationRepo.remove(location);
  }

  async findByQRCode(qrCode: string): Promise<Location> {
    const location = await this.locationRepo.findOne({ where: { qrCode } });
    return location;
  }
}

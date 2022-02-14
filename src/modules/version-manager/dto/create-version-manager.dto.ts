import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class createVersionManagerDto {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  iosVersion: string;


  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  androidVersion: string;
}

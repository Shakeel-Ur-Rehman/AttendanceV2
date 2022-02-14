import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateGroupPolicyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  checkinTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  checkoutTime: string;

  @ApiProperty()
  @IsOptional()
  employees: number[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  tags: string;
}

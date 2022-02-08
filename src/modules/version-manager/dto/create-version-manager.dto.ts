import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class createVersionManagerDto {

  @IsNotEmpty()
  @IsString()
  iosVersion: string;


  @IsNotEmpty()
  @IsString()
  androidVersion: string;
}

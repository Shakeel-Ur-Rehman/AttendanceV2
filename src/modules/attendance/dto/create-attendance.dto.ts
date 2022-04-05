import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateAttendanceDto {
  @IsNotEmpty()
  locationId: number;

  @IsNotEmpty()
  employeeId: number;

  @IsOptional()
  currentTime: string;

  @IsOptional()
  deviceId: string;

  @IsString()
  checkInType: string;
}

export class createAttendanceWithParamsDto {
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

  @IsNumber()
  @IsNotEmpty()
  employeeId: number;

  @IsString()
  @IsNotEmpty()
  checkInTime: string;

  @IsString()
  @IsNotEmpty()
  checkoutTime: string;

  @IsString()
  shift: string;

  @IsString()
  @IsOptional()
  checkInId: string;

  @IsOptional()
  deviceId: string;

  @IsOptional()
  checkInType: string;

  @IsOptional()
  checkOutType: string;

  @IsOptional()
  checkInDeviceId: string;

  @IsOptional()
  checkOutDeviceId: string;
}

export class CheckoutDto {
  @IsNumber()
  @IsNotEmpty()
  rowId: number;

  @IsString()
  @IsOptional()
  qrCode: string;

  @IsOptional()
  currentTime: string;

  @IsOptional()
  deviceId: string;

  @IsString()
  checkOutType: string;
}

export class CreateAttendanceWithQRCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  locationId: number[] | number;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  qrCode: string;

  @IsOptional()
  @ApiProperty()
  currentTime: string;

  @IsOptional()
  @ApiProperty()
  deviceId: string;

  @IsString()
  @ApiProperty()
  checkInType: string;
}

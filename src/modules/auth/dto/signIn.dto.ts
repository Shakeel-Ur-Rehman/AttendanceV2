import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator";

export class SignInDto{
    @ApiProperty()
    username:string

    @ApiProperty()
    password:string


    @ApiProperty()
      @IsString()
      @IsOptional()
      deviceId: string;
    
      @ApiProperty({
        required: false,
        example: 'android || iphone',
      })
      @IsString()
      @IsOptional()
      deviceType: string;
    
      @ApiProperty({
        required: true,
        example: '1.2.3',
      })
      @IsOptional()
      version: string;
    
      @ApiProperty({
        required: true,
        example: '1.2.3',
      })
      @IsOptional()
      osVersion: string | number;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRolesEnum } from "src/enums/userRole.enum";

export class CreateAdminUserDto {
    type: UserRolesEnum;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    password?: string;
  
    @IsOptional()
    profileId: number;
  }
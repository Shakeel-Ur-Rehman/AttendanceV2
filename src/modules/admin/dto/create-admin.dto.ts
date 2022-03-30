import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { CreateAdminUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateAdminDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  avatar?: number;

  @ApiProperty({ type: () => CreateAdminUserDto })
  @ValidateNested({ each: true })
  @Type(() => CreateAdminUserDto)
  authUser: CreateAdminUserDto;
}

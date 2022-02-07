import { ApiTags } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AttendanceType } from 'src/enums/attendanceType.enum';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags("Employee")
@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: AttendanceType, default: AttendanceType.SINGLE })
  @IsString()
  @IsNotEmpty()
  attendanceType: AttendanceType;

  @Column({ default: '' })
  @IsString()
  @IsOptional()
  checkInRowId?: string;

  @Column({ default: 100 })
  @IsNumber()
  @IsNotEmpty()
  attendanceRadius: number;

  @Column({ default: null })
  @IsNotEmpty()
  macAddress: string;

  @Column({ default: false })
  @IsNotEmpty()
  isMac: boolean;

  @Column({ nullable: true })
  avatarId: number;

  @OneToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  authUser: User;

 
}

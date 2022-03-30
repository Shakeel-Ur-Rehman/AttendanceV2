import { ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AttendanceType } from 'src/enums/attendanceType.enum';
import { UserStatusEnum } from 'src/enums/userStatus.enum';
import { Attendance } from 'src/modules/attendance/entities/attendance.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { GroupPolicy } from 'src/modules/group-policy/entities/group-policy.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ApiTags('Employee')
@Entity('employees')
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

  @OneToOne(() => File, { lazy: true, nullable: true })
  @JoinColumn()
  avatar: File;

  @OneToMany(() => Attendance, (attendances) => attendances.employee, {
    lazy: true,
  })
  attendances: Attendance[];

  @ManyToOne(() => GroupPolicy, (group) => group.employees, {
    eager: true,
    onDelete: 'SET NULL',
  })
  public group: GroupPolicy;

  static createInitialDataObject = (empData: Object) => {
    // #TODO: change the status enum
    var initialData = {};
    if (Object.keys(empData).length > 0) {
      initialData = {
        'Employee No': empData['emp_No'],
        Name: empData['emP_Name'],
        Position: empData['position_Name'],
        Department: empData['department_Name'],
        Branch: empData['location_Name'],
        Role: empData['role'] || '',
        'Mac Address': empData['Mac_Address'] || 'NA',
        'Location Type': empData['location_Type'] || '',
        'Assigned Location': empData['assigned_Location'] || '',
        HOD: empData['HOD'] || '',
        'Early Check-In Allowed': empData['early_Check_In_Allowed'] || '',
        Status: UserStatusEnum.ACTIVE,
        lastWorkingDate: empData['lastWorkingDate'],
      };
    }
    return initialData;
  };
}

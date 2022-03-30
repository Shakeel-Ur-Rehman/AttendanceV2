import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('group_policies')
export class GroupPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  checkinTime: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  checkoutTime: string;

  @ApiProperty()
  @Column({ default: null })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @OneToMany(() => Employee, (employee) => employee.group)
  employees: Employee[];

  @ManyToOne(() => User, (user) => user.groupPolicies, {
    lazy: true,
    onDelete: 'SET NULL',
  })
  public owner: User;
}

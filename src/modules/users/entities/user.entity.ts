import { UserRolesEnum } from 'src/enums/userRole.enum';
import { UserStatusEnum } from 'src/enums/userStatus.enum';
import { UserProperties } from 'src/interfaces/user.interface';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { GroupPolicy } from 'src/modules/group-policy/entities/group-policy.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  type: UserRolesEnum;

  @Column()
  status: UserStatusEnum;

  @Column({ type: 'jsonb' })
  initial_data: UserProperties;

  @Column({ nullable: true })
  device_id: string;

  @Column({ nullable: true })
  device_type: string;

  @Column({ default: false })
  multidevice: boolean;

  @Column({ default: false })
  qr_checkin_allowed: boolean;

  @Column({ default: false })
  face_checkin_allowed: boolean;

  @OneToOne(() => Employee, (employee: Employee) => employee.authUser, {
    lazy: true,
  })
  public employee: Employee;

  @OneToMany(() => GroupPolicy, (group) => group.owner)
  groupPolicies: GroupPolicy[];
}

import { UserRolesEnum } from 'src/enums/userRole.enum';
import { UserStatusEnum } from 'src/enums/userStatus.enum';
import { UserProperties } from 'src/interfaces/user.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ unique: true })
  username: string;

  @Column()
  password:string

  @Column()
  type:UserRolesEnum

  @Column()
  status:UserStatusEnum


  @Column({type:"jsonb"})
  initial_data:UserProperties

  @Column()
  device_id:string

  @Column()
  device_type:string

  @Column({default:false})
  multidevice:boolean

  @Column({default:false})
  qr_checkin_allowed:boolean

  @Column({default:false})
  face_checkin_allowed:boolean

}

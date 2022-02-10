import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("attendances")
export class Attendance {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    checkin_time:Date

    @Column({nullable:true})
    checkout_time:Date

    @Column()
    is_archived:true

    @Column()
    checkin_device_id:string

    @Column()
    checkin_type: string

    @Column()
    checkin_face: string


    @Column()
    checkin_id:string

    @Column()
    location_id:number

    @Column({default:false})
    is_night_shift:boolean

}

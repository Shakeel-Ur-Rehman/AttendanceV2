import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('version_manager')
export class VersionManager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_active: boolean;

  @Column()
  ios_version: string;

  @Column()
  android_version: string;

  @Column({ default: new Date() })
  createdAt: Date;
}

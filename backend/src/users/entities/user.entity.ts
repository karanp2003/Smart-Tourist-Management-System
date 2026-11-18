import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../common/enums';
import { TouristProfile } from '../../tourists/entities/tourist-profile.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { AuditLog } from '../../audit-logs/entities/audit-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true, length: 30 })
  phone?: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.TOURIST })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => TouristProfile, (profile) => profile.user)
  touristProfile?: TouristProfile;

  @OneToMany(() => Notification, (n) => n.user)
  notifications?: Notification[];

  @OneToMany(() => AuditLog, (a) => a.user)
  auditLogs?: AuditLog[];
}
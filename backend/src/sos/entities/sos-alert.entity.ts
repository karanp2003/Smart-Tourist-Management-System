import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SosStatus } from '../../common/enums';
import { TouristProfile } from '../../tourists/entities/tourist-profile.entity';

@Entity('sos_alerts')
export class SosAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  touristProfileId: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ type: 'simple-enum', enum: SosStatus, default: SosStatus.NEW })
  status: SosStatus;

  @Column({ nullable: true })
  acknowledgedBy?: string;

  @Column({ type: 'datetime', nullable: true })
  acknowledgedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'text', nullable: true })
  statusHistory?: string;

  @Column({
    default:
      'This SOS alert notifies platform administrators only. It does not automatically contact police, ambulance, or government emergency services.',
  })
  disclaimer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TouristProfile, (profile) => profile.sosAlerts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristProfileId' })
  touristProfile: TouristProfile;
}
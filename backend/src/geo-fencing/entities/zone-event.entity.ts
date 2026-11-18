import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TouristProfile } from '../../tourists/entities/tourist-profile.entity';
import { SafetyZone } from '../../safety-zones/entities/safety-zone.entity';

@Entity('zone_events')
export class ZoneEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  touristProfileId: string;

  @Column()
  zoneId: string;

  @Column()
  eventType: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => TouristProfile, (profile) => profile.zoneEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristProfileId' })
  touristProfile: TouristProfile;

  @ManyToOne(() => SafetyZone, (zone) => zone.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zoneId' })
  zone: SafetyZone;
}
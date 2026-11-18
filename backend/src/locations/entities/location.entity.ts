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

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  touristProfileId: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'float', nullable: true })
  accuracy?: number;

  @Column({ type: 'float', nullable: true })
  speed?: number;

  @Column({ nullable: true })
  zoneType?: string;

  @Column({ type: 'float', nullable: true })
  anomalyScore?: number;

  @Column({ default: false })
  isAnomaly: boolean;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => TouristProfile, (profile) => profile.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristProfileId' })
  touristProfile: TouristProfile;
}
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DigitalId } from '../../digital-id/entities/digital-id.entity';
import { Location } from '../../locations/entities/location.entity';
import { Incident } from '../../incidents/entities/incident.entity';
import { SosAlert } from '../../sos/entities/sos-alert.entity';
import { ZoneEvent } from '../../geo-fencing/entities/zone-event.entity';

@Entity('tourist_profiles')
export class TouristProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  touristId: string;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true })
  emergencyContactName?: string;

  @Column({ nullable: true })
  emergencyContactPhone?: string;

  @Column({ default: false })
  locationSharingEnabled: boolean;

  @Column({ type: 'float', nullable: true })
  lastLatitude?: number;

  @Column({ type: 'float', nullable: true })
  lastLongitude?: number;

  @Column({ type: 'datetime', nullable: true })
  lastLocationAt?: Date;

  @Column({ nullable: true })
  currentZoneType?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.touristProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => DigitalId, (digitalId) => digitalId.touristProfile)
  digitalId?: DigitalId;

  @OneToMany(() => Location, (location) => location.touristProfile)
  locations?: Location[];

  @OneToMany(() => Incident, (incident) => incident.touristProfile)
  incidents?: Incident[];

  @OneToMany(() => SosAlert, (sos) => sos.touristProfile)
  sosAlerts?: SosAlert[];

  @OneToMany(() => ZoneEvent, (event) => event.touristProfile)
  zoneEvents?: ZoneEvent[];
}
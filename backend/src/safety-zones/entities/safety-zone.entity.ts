import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ZoneType } from '../../common/enums';
import { ZoneEvent } from '../../geo-fencing/entities/zone-event.entity';

@Entity('safety_zones')
export class SafetyZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-enum', enum: ZoneType })
  zoneType: ZoneType;

  @Column({ type: 'float' })
  centerLat: number;

  @Column({ type: 'float' })
  centerLng: number;

  @Column({ type: 'float' })
  radiusMeters: number;

  /** Optional GeoJSON polygon as JSON string */
  @Column({ type: 'text', nullable: true })
  boundaryCoordinates?: string;

  @Column({ default: 'MEDIUM' })
  severity: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ZoneEvent, (event) => event.zone)
  events?: ZoneEvent[];
}
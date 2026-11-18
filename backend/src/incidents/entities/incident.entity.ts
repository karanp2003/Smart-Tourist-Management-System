import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncidentStatus } from '../../common/enums';
import { TouristProfile } from '../../tourists/entities/tourist-profile.entity';
import { IncidentAnalysis } from './incident-analysis.entity';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  touristProfileId: string;

  @Column()
  category: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  incidentAt: Date;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  attachmentPath?: string;

  @Column({ nullable: true })
  severity?: string;

  @Column({
    type: 'simple-enum',
    enum: IncidentStatus,
    default: IncidentStatus.SUBMITTED,
  })
  status: IncidentStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TouristProfile, (profile) => profile.incidents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristProfileId' })
  touristProfile: TouristProfile;

  @OneToOne(() => IncidentAnalysis, (analysis) => analysis.incident)
  analysis?: IncidentAnalysis;
}
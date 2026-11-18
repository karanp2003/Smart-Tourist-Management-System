import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Incident } from './incident.entity';

@Entity('incident_analysis')
export class IncidentAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  incidentId: string;

  @Column({ nullable: true })
  aiCategory?: string;

  @Column({ nullable: true })
  aiSeverity?: string;

  @Column({ type: 'text', nullable: true })
  aiExplanation?: string;

  @Column({ type: 'text', nullable: true })
  aiRecommendation?: string;

  @Column({ type: 'text', nullable: true })
  extractedInfo?: string;

  @Column({ type: 'text', nullable: true })
  rawResponse?: string;

  /** pending | available | unavailable */
  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Incident, (incident) => incident.analysis, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'incidentId' })
  incident: Incident;
}
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VerificationStatus } from '../../common/enums';
import { TouristProfile } from '../../tourists/entities/tourist-profile.entity';

@Entity('digital_ids')
export class DigitalId {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  touristProfileId: string;

  @Column({ unique: true })
  digitalIdNumber: string;

  @Column()
  identityHash: string;

  @Column({ nullable: true })
  blockchainTransactionHash?: string;

  @Column({ default: 'pending' })
  blockchainStatus: string;

  @Column({
    type: 'simple-enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  verificationStatus: VerificationStatus;

  @Column({ nullable: true })
  verifiedBy?: string;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt?: Date;

  @Column({
    default:
      'Prototype blockchain Digital Tourist ID for academic demonstration. Not a government-issued identity document.',
  })
  disclaimer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => TouristProfile, (profile) => profile.digitalId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'touristProfileId' })
  touristProfile: TouristProfile;
}
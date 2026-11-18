import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { TouristProfile } from '../tourists/entities/tourist-profile.entity';
import { DigitalId } from '../digital-id/entities/digital-id.entity';
import { UserRole, VerificationStatus } from '../common/enums';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { BlockchainService } from '../blockchain/blockchain.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(TouristProfile)
    private readonly profilesRepo: Repository<TouristProfile>,
    @InjectRepository(DigitalId)
    private readonly digitalIdRepo: Repository<DigitalId>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly blockchainService: BlockchainService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepo.create({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash,
      phone: dto.phone,
      role: UserRole.TOURIST,
    });
    await this.usersRepo.save(user);

    const touristId = this.generateTouristId();
    const profile = this.profilesRepo.create({
      userId: user.id,
      touristId,
      nationality: dto.nationality,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
    });
    await this.profilesRepo.save(profile);

    const identityHash = createHash('sha256')
      .update(`${touristId}:${user.email}:${user.id}`)
      .digest('hex');

    const digitalIdNumber = `DTID-${touristId}`;
    let blockchainTx: string | undefined;
    let blockchainStatus = 'offline';
    let verificationStatus = VerificationStatus.PENDING;

    try {
      const result = await this.blockchainService.registerIdentityHash(
        digitalIdNumber,
        identityHash,
      );
      if (result?.txHash) {
        blockchainTx = result.txHash;
        blockchainStatus = 'registered';
        verificationStatus = VerificationStatus.BLOCKCHAIN_PENDING;
      }
    } catch {
      blockchainStatus = 'offline';
    }

    const digitalId = this.digitalIdRepo.create({
      userId: user.id,
      touristProfileId: profile.id,
      digitalIdNumber,
      identityHash,
      blockchainTransactionHash: blockchainTx,
      blockchainStatus,
      verificationStatus,
    });
    await this.digitalIdRepo.save(digitalId);

    await this.auditLogs.create(user.id, 'REGISTER', 'User', user.id, 'Tourist registered');

    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user, profile, digitalId),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
      relations: ['touristProfile', 'touristProfile.digitalId'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is inactive');

    if (dto.expectedRole && user.role !== dto.expectedRole) {
      throw new BadRequestException(`This login is for ${dto.expectedRole} accounts only`);
    }

    await this.auditLogs.create(user.id, 'LOGIN', 'User', user.id);
    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user: this.sanitizeUser(user, user.touristProfile, user.touristProfile?.digitalId),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersRepo.findOne({
        where: { id: payload.sub },
        relations: ['touristProfile', 'touristProfile.digitalId'],
      });
      if (!user || !user.isActive) throw new UnauthorizedException();
      return {
        ...(await this.issueTokens(user)),
        user: this.sanitizeUser(user, user.touristProfile, user.touristProfile?.digitalId),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async me(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['touristProfile', 'touristProfile.digitalId'],
    });
    if (!user) throw new UnauthorizedException();
    return this.sanitizeUser(user, user.touristProfile, user.touristProfile?.digitalId);
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '1d'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }

  private generateTouristId(): string {
    const year = new Date().getFullYear();
    const suffix = randomBytes(3).toString('hex').toUpperCase();
    return `ST-${year}-${suffix}`;
  }

  private sanitizeUser(user: User, profile?: TouristProfile, digitalId?: DigitalId) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      touristProfile: profile
        ? {
            id: profile.id,
            touristId: profile.touristId,
            nationality: profile.nationality,
            emergencyContactName: profile.emergencyContactName,
            emergencyContactPhone: profile.emergencyContactPhone,
            locationSharingEnabled: profile.locationSharingEnabled,
            lastLatitude: profile.lastLatitude,
            lastLongitude: profile.lastLongitude,
            lastLocationAt: profile.lastLocationAt,
            currentZoneType: profile.currentZoneType,
          }
        : null,
      digitalId: digitalId
        ? {
            digitalIdNumber: digitalId.digitalIdNumber,
            verificationStatus: digitalId.verificationStatus,
            blockchainStatus: digitalId.blockchainStatus,
            blockchainTransactionHash: digitalId.blockchainTransactionHash,
            createdAt: digitalId.createdAt,
            disclaimer: digitalId.disclaimer,
          }
        : null,
    };
  }
}
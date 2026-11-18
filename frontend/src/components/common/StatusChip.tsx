import { Chip } from '@mui/material';
import { colors, zoneColors } from '../../theme/theme';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  SUBMITTED: { bg: '#DBEAFE', color: colors.blue },
  UNDER_REVIEW: { bg: '#FEF3C7', color: '#B45309' },
  IN_PROGRESS: { bg: '#E0E7FF', color: '#4338CA' },
  RESOLVED: { bg: '#DCFCE7', color: colors.success },
  CLOSED: { bg: '#E2E8F0', color: colors.secondary },
  NEW: { bg: '#FEE2E2', color: colors.danger },
  ACKNOWLEDGED: { bg: '#FEF3C7', color: '#B45309' },
  ASSISTANCE_IN_PROGRESS: { bg: '#FFEDD5', color: '#C2410C' },
  PENDING: { bg: '#FEF3C7', color: '#B45309' },
  VERIFIED: { bg: '#DCFCE7', color: colors.success },
  REJECTED: { bg: '#FEE2E2', color: colors.danger },
  BLOCKCHAIN_PENDING: { bg: '#E0E7FF', color: '#4338CA' },
  LOW: { bg: '#DCFCE7', color: colors.success },
  MEDIUM: { bg: '#FEF3C7', color: '#B45309' },
  HIGH: { bg: '#FFEDD5', color: '#C2410C' },
  CRITICAL: { bg: '#FEE2E2', color: colors.danger },
  SAFE: { bg: '#DCFCE7', color: zoneColors.SAFE },
  CAUTION: { bg: '#FEF9C3', color: '#A16207' },
  HIGH_RISK: { bg: '#FFEDD5', color: zoneColors.HIGH_RISK },
  RESTRICTED: { bg: '#FEE2E2', color: zoneColors.RESTRICTED },
  ACTIVE: { bg: '#DCFCE7', color: colors.success },
  INACTIVE: { bg: '#E2E8F0', color: colors.secondary },
};

interface StatusChipProps {
  status: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const palette = STATUS_COLORS[status] ?? { bg: '#E2E8F0', color: colors.secondary };
  return (
    <Chip
      label={status.replaceAll('_', ' ')}
      size={size}
      sx={{
        bgcolor: palette.bg,
        color: palette.color,
        fontWeight: 600,
        borderRadius: 1.5,
      }}
    />
  );
}

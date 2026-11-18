import { Box, Card, CardContent, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { colors } from '../../theme/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = colors.blue,
}: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: `${accent}14`,
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, color: colors.text, fontWeight: 700 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

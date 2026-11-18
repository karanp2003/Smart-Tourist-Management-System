import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminAnalytics } from '../../types';
import { colors, zoneColors } from '../../theme/theme';
import EmptyState from '../common/EmptyState';

const CHART_COLORS = [colors.blue, colors.navy, colors.warning, colors.danger, colors.success, '#7C3AED'];

interface IncidentChartsProps {
  analytics?: AdminAnalytics | null;
}

function ChartCard({ title, children, empty }: { title: string; children: React.ReactNode; empty?: boolean }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box sx={{ height: 280 }}>
          {empty ? <EmptyState title="No data" description="Analytics will appear once events are recorded." /> : children}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function IncidentCharts({ analytics }: IncidentChartsProps) {
  const incidentsOverTime = analytics?.incidentsOverTime ?? [];
  const sosOverTime = analytics?.sosOverTime ?? [];
  const byCategory = analytics?.incidentsByCategory ?? [];
  const bySeverity = analytics?.incidentsBySeverity ?? [];
  const zoneDistribution = analytics?.zoneDistribution ?? [];

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Incidents over time" empty={incidentsOverTime.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incidentsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={colors.blue} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="SOS alerts over time" empty={sosOverTime.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sosOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={colors.danger} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Incidents by category" empty={byCategory.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill={colors.blue} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Severity distribution" empty={bySeverity.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={bySeverity} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={90} label>
                {bySeverity.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      {zoneDistribution.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <ChartCard title="Zone distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="zoneType" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {zoneDistribution.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={zoneColors[entry.zoneType] || CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      )}
    </Grid>
  );
}

import { createTheme } from '@mui/material/styles';

export const colors = {
  navy: '#142B4A',
  blue: '#2563EB',
  bg: '#F5F7FA',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  text: '#1E293B',
  secondary: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
} as const;

export const zoneColors: Record<string, string> = {
  SAFE: '#16A34A',
  CAUTION: '#EAB308',
  HIGH_RISK: '#F97316',
  RESTRICTED: '#DC2626',
};

export const JAIPUR_CENTER: [number, number] = [26.9124, 75.7873];

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.blue,
      dark: colors.navy,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.navy,
      contrastText: colors.white,
    },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.danger },
    background: {
      default: colors.bg,
      paper: colors.white,
    },
    text: {
      primary: colors.text,
      secondary: colors.secondary,
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(20, 43, 74, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.navy,
          color: colors.white,
          borderRight: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          color: colors.text,
          boxShadow: '0 1px 3px rgba(20, 43, 74, 0.08)',
        },
      },
    },
  },
});

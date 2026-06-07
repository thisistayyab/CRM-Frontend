import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CompanyAttribution from '../CompanyAttribution';
import ThemeToggle from '../ThemeToggle';
import Content from './components/Content';
import { brandColors } from '../../constants/brandColors';

export default function AuthPageShell({ children }) {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          pointerEvents: 'none',
          '& > *': { pointerEvents: 'auto' },
        }}
      >
        <ThemeToggle sx={{ width: { xs: '100%', sm: 220 } }} />
      </Box>

      <Box
        component="main"
        sx={(theme) => ({
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 9, sm: 8 },
          position: 'relative',
          bgcolor: 'background.default',
          '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: -2,
            inset: 0,
            background: brandColors.light.background,
            ...theme.applyStyles('dark', {
              background: brandColors.gradient.og,
            }),
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage: brandColors.gradient.authGlow,
            pointerEvents: 'none',
          },
        })}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: { xs: 2, md: 4 },
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 6, lg: 8 }}
            alignItems="center"
            justifyContent="center"
            sx={{ width: '100%', maxWidth: 1040 }}
          >
            <Box sx={{ flex: 1, width: '100%', maxWidth: 440, display: { xs: 'none', md: 'block' } }}>
              <Content />
            </Box>
            <Box sx={{ width: '100%', maxWidth: 450, flexShrink: 0 }}>
              {children}
            </Box>
          </Stack>
        </Box>

        <Box sx={{ pb: 3, px: 2, width: '100%', maxWidth: 1040, mx: 'auto' }}>
          <CompanyAttribution />
        </Box>
      </Box>
    </>
  );
}

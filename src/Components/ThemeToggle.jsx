import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useColorScheme } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export default function ThemeToggle({ sx }) {
  const theme = useTheme();
  const { mode, setMode, systemMode } = useColorScheme();

  if (!mode) return null;

  const resolved = mode === 'system' ? (systemMode || 'light') : mode;
  const isDark = resolved === 'dark';

  const segmentSx = (active) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.75,
    zIndex: 1,
    cursor: 'pointer',
    userSelect: 'none',
    color: active ? '#fff' : 'text.disabled',
    transition: 'color 0.2s',
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: 40,
          borderRadius: 99,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.35),
          bgcolor: (t) => t.palette.mode === 'dark'
            ? alpha(t.palette.primary.main, 0.12)
            : alpha(t.palette.primary.main, 0.08),
          p: '3px',
          transition: 'background-color 0.2s, border-color 0.2s',
          '&:hover': {
            borderColor: alpha(theme.palette.primary.main, 0.55),
          },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 3,
            bottom: 3,
            left: isDark ? 3 : 'calc(50%)',
            width: 'calc(50% - 3px)',
            borderRadius: 99,
            background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            transition: 'left 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.45)}`,
          }}
        />
        <Box
          role="button"
          tabIndex={0}
          aria-pressed={isDark}
          aria-label="Dark mode"
          onClick={() => setMode('dark')}
          onKeyDown={(e) => e.key === 'Enter' && setMode('dark')}
          sx={segmentSx(isDark)}
        >
          <DarkModeOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography component="span" sx={{ fontSize: 13, fontWeight: isDark ? 600 : 500, lineHeight: 1 }}>
            Dark
          </Typography>
        </Box>
        <Box
          role="button"
          tabIndex={0}
          aria-pressed={!isDark}
          aria-label="Light mode"
          onClick={() => setMode('light')}
          onKeyDown={(e) => e.key === 'Enter' && setMode('light')}
          sx={segmentSx(!isDark)}
        >
          <LightModeOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography component="span" sx={{ fontSize: 13, fontWeight: !isDark ? 600 : 500, lineHeight: 1 }}>
            Light
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

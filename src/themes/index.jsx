import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Palette from './palette';
import Typography from './typography';
import { FONT_FAMILY, brandColors } from '../constants/brandColors';
import CustomShadows from './shadows';
import componentsOverride from './overrides';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }) {
  return (
    <CssVarsProvider defaultMode="dark" modeStorageKey="taylance-crm-color-mode">
      <ThemeWithMode>{children}</ThemeWithMode>
    </CssVarsProvider>
  );
}

function ThemeWithMode({ children }) {
  const { mode = 'system' } = useColorScheme();
  // Only allow 'light' or 'dark' for Palette
  let paletteMode = mode;
  if (mode === 'system') {
    paletteMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(paletteMode);
    root.style.colorScheme = paletteMode;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', paletteMode === 'dark' ? brandColors.dark.background : brandColors.light.background);
    }
  }, [paletteMode]);

  const baseTheme = Palette(paletteMode);
  const themeTypography = Typography(FONT_FAMILY);
  const themeCustomShadows = useMemo(() => CustomShadows(baseTheme), [baseTheme]);
  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: 'ltr',
      shape: {
        borderRadius: 10,
      },
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: baseTheme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [baseTheme, themeTypography, themeCustomShadows]
  );
  // Create the theme first so it has all MUI utilities
  const theme = createTheme({
    ...baseTheme,
    ...themeOptions,
  });
  // Now set components, passing the full theme object
  theme.components = {
    ...componentsOverride(theme),
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            colorScheme: paletteMode,
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: paletteMode === 'dark' ? '#475569 #111827' : undefined,
            fontFamily: FONT_FAMILY,
            boxSizing: 'border-box',
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
            backgroundColor: paletteMode === 'dark' ? '#111827' : undefined,
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: paletteMode === 'dark' ? '#475569' : undefined,
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: paletteMode === 'dark' ? '#111827' : undefined,
          },
          html: {
            backgroundColor: theme.palette.background.default,
          },
          body: {
            fontFamily: FONT_FAMILY,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          '.text-gradient': {
            background: brandColors.gradient.headline,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          },
          '#root': {
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
          'input, textarea, select': {
            color: theme.palette.text.primary,
          },
          '::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.9,
          },
          '.MuiSvgIcon-root': {
            color: 'inherit',
          },
          '.MuiDataGrid-root': {
            borderColor: `${theme.palette.divider} !important`,
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.text.primary} !important`,
          },
          '.MuiDataGrid-columnHeaders, .MuiDataGrid-footerContainer': {
            backgroundColor: `${paletteMode === 'dark' ? theme.palette.background.neutral : theme.palette.background.default} !important`,
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
          '.MuiDataGrid-cell, .MuiDataGrid-columnHeader, .MuiDataGrid-row': {
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
          '.MuiDataGrid-row:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
          '.MuiDataGrid-row.Mui-selected, .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: `${theme.palette.action.selected} !important`,
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none !important',
          },
          '.MuiDataGrid-overlayWrapper': {
            minHeight: '240px !important',
          },
          '.MuiDataGrid-overlayWrapperInner': {
            height: '100% !important',
          },
          '.MuiDataGrid-filler, .MuiDataGrid-scrollbarFiller': {
            backgroundColor: `${paletteMode === 'dark' ? theme.palette.background.neutral : theme.palette.background.default} !important`,
          },
          '.MuiPopover-root .MuiPaper-root, .MuiMenu-paper': {
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.text.primary} !important`,
            backgroundImage: 'none !important',
          },
          '.MuiMenu-list': {
            color: `${theme.palette.text.primary} !important`,
          },
          '.MuiMenuItem-root': {
            color: `${theme.palette.text.primary} !important`,
          },
          '.MuiMenuItem-root:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
          '.MuiMenuItem-root.Mui-selected': {
            backgroundColor: `${theme.palette.action.selected} !important`,
            color: `${theme.palette.text.primary} !important`,
          },
          '.MuiMenuItem-root.Mui-disabled': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: '1 !important',
          },
          '.MuiSelect-select, .MuiOutlinedInput-input, .MuiInputBase-input': {
            color: `${theme.palette.text.primary} !important`,
          },
          '.MuiInputLabel-root': {
            color: `${theme.palette.text.secondary} !important`,
          },
          '.MuiInputLabel-root.Mui-focused': {
            color: `${theme.palette.primary.main} !important`,
          },
          '.MuiFormHelperText-root': {
            color: `${theme.palette.text.secondary} !important`,
          },
          '.MuiChip-root.MuiChip-colorDefault': {
            color: `${paletteMode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800]} !important`,
            backgroundColor: `${paletteMode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]} !important`,
          },
          '.MuiButton-containedPrimary': {
            color: `${theme.palette.primary.contrastText} !important`,
          },
          '.MuiButton-containedSecondary': {
            color: `${theme.palette.secondary.contrastText} !important`,
          },
          '.MuiButton-containedError': {
            color: `${theme.palette.error.contrastText} !important`,
          },
          '.MuiButton-containedSuccess': {
            color: `${theme.palette.success.contrastText} !important`,
          },
          '.MuiButton-containedWarning': {
            color: `${theme.palette.warning.contrastText} !important`,
          },
          '.MuiButton-containedInfo': {
            color: `${theme.palette.info.contrastText} !important`,
          },
          '.MuiButton-outlined': {
            borderColor: `${theme.palette.divider} !important`,
          },
          '.MuiIconButton-root': {
            color: `${theme.palette.text.secondary} !important`,
          },
          '.MuiIconButton-root:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
            color: `${theme.palette.text.primary} !important`,
          },
        },
      },
  };
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeWithMode.propTypes = { children: PropTypes.node };
ThemeCustomization.propTypes = { children: PropTypes.node };

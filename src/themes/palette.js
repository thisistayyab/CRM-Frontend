// material-ui
import { createTheme } from '@mui/material/styles';

// third-party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme/index.js';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = mode === 'dark' ? presetDarkPalettes : presetPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: mode === 'dark'
        ? {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: '#888'
          }
        : {
            primary: paletteColor.grey[700],
            secondary: paletteColor.grey[500],
            disabled: paletteColor.grey[400]
          },
      action: mode === 'dark'
        ? {
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
          }
        : {
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: paletteColor.grey[300],
            disabledBackground: paletteColor.grey[200]
          },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : paletteColor.grey[200],
      background: mode === 'dark'
        ? {
            paper: 'hsl(220, 30%, 7%)',
            default: 'hsl(220, 35%, 3%)'
          }
        : {
            paper: paletteColor.grey[0],
            default: paletteColor.grey.A50
          }
    }
  });
}

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import logo from '../assets/images/logo.png';

const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: '#4f8cff', fontSize: 32 }} />,
    title: 'Adaptable performance',
    description:
      'Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: '#4f8cff', fontSize: 32 }} />,
    title: 'Built to last',
    description:
      'Experience unmatched durability that goes above and beyond with lasting investment.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: '#4f8cff', fontSize: 32 }} />,
    title: 'Great user experience',
    description:
      'Integrate our product into your routine with an intuitive and easy-to-use interface.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: '#4f8cff', fontSize: 32 }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 5, maxWidth: 500, color: '#fff', fontFamily: 'Urbanist, sans-serif', px: { xs: 2, md: 8 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box component="img" src={logo} alt="Taylance Logo" sx={{ width: 36, height: 36, mr: 1 }} />
        <Typography variant="h5" sx={{ color: '#4f8cff', fontWeight: 700, fontFamily: 'Urbanist, sans-serif', fontSize: 28 }}>
          Taylance
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 3, alignItems: 'flex-start' }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 700, fontFamily: 'Urbanist, sans-serif', color: '#fff', fontSize: 20 }}>
              {item.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#b4c0d3', fontFamily: 'Urbanist, sans-serif', fontSize: 16 }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
} 
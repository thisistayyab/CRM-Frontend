import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { COMPANY_NAME, COMPANY_URL } from '../constants/brand';

export default function CompanyAttribution({ variant = 'caption', sx }) {
  return (
    <Typography variant={variant} color="text.secondary" sx={{ textAlign: 'center', ...sx }}>
      Owned &amp; maintained by{' '}
      <Link href={COMPANY_URL} target="_blank" rel="noopener noreferrer" underline="hover">
        {COMPANY_NAME}
      </Link>
    </Typography>
  );
}

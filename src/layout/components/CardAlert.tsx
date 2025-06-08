import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export default function CardAlert() {
  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 1 }}>
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Contact
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Request a feature or report an issue.
        </Typography>
        <Button
          variant="contained"
          size="small"
          fullWidth
          component="a"
          href="https://github.com/nuar-dev/warehouse_simulation/issues/new?template=bug_report.yml"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Issues
        </Button>
      </CardContent>
    </Card>
  );
}

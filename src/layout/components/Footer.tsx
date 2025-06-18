import React from 'react';
import Box from '@mui/material/Box';

const SIDEBAR_WIDTH = 240; // match your SideMenu width
const FOOTER_HEIGHT = 70;  // desired footer height

export type FooterProps = {
  /** Whatever footer content (tabs, status bar, etc.) */
  children: React.ReactNode;
};

export default function Footer({ children }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: SIDEBAR_WIDTH,
        right: 0,
        height: FOOTER_HEIGHT,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.appBar - 1,
        display: 'flex',
        alignItems: 'center',
        px: 2,
      }}
    >
      {children}
    </Box>
  );
}

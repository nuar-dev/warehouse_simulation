// src/components/dashboard/components/Header.tsx

import * as React from 'react';
import Stack from '@mui/material/Stack';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from './ColorModeIconDropdown';
import Search from './Search';
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={(theme) => ({
        display: { xs: 'none', md: 'flex' },
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,       // above page content
        bgcolor: 'background.paper',       // ensure opaque background
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
        // optional: add a bottom border/shadow
        borderBottom: 1,
        borderColor: 'divider',
      })}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <NotificationDropdown />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

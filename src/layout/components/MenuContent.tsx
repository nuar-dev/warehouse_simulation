import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

import { NavLink, NavLinkProps } from 'react-router-dom';



const NavListItemButton = React.forwardRef<HTMLAnchorElement, NavLinkProps & { className?: string }>(
  function NavListItemButton(props, ref) {
    const { className, ...rest } = props;
    return (
      <NavLink
        {...rest}
        ref={ref}
        className={({ isActive }) => [className, isActive ? 'active-menu-item' : ''].filter(Boolean).join(' ')}
        style={{ textDecoration: 'none', color: 'inherit' }}
      />
    );
  }
);



const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/' },
  { text: 'Simulation Settings', icon: <AnalyticsRoundedIcon />, path: '/simSetting' },
  { text: 'Warehouse', icon: <PeopleRoundedIcon />, path: '/warehouse' },
  { text: 'Impact Analysis', icon: <AssignmentRoundedIcon />, path: '/impactAnalysis' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block', mb: 2 }}>
            <ListItemButton component={NavListItemButton} to={item.path} sx={{ py: 0.5, display: 'flex', alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: 30, marginRight: 1, alignItems: 'center', display: 'flex' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ margin: 0, '.MuiTypography-root': { lineHeight: 3, lineWidth: 3, margin: 0, } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={NavListItemButton} to={item.path} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32, marginRight: 1, alignItems: 'center', display: 'flex' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ margin: 0, '.MuiTypography-root': { lineHeight: 1, margin: 0 } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

// src/components/notifications/NotificationDropdown.tsx

import React from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
    const { notifications, removeNotification } = useNotificationContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (id: string, route?: string) => {
        removeNotification(id);
        handleClose();
        if (route) navigate(route);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsRoundedIcon />
                </Badge>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {notifications.length === 0 ? (
                    <MenuItem disabled>No notifications</MenuItem>
                ) : (
                    notifications.map(({ id, message, route }) => (
                        <MenuItem key={id} onClick={() => handleSelect(id, route)}>
                            <ListItemText primary={message} />
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
}

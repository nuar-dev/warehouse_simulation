import React, { useState } from "react";

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import Dashboard from "./dashboard/Dashboard";
import BlankPage from "./BlankPage";
import Settings from "./Settings";

type TabType = "dashboard" | "blank" | "settings";

const drawerWidth = 220;

export default function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabType) => {
    setActiveTab(newValue);
  };

  // Sidebar menu click handler
  const handleSidebarClick = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#f0f0f3' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Menu</Typography>
          <List>
            <ListItemButton selected={activeTab === "dashboard"} onClick={() => handleSidebarClick("dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton selected={activeTab === "blank"} onClick={() => handleSidebarClick("blank")}>
              <ListItemText primary="Blank Page" />
            </ListItemButton>
            <ListItemButton selected={activeTab === "settings"} onClick={() => handleSidebarClick("settings")}>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tab Bar */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          aria-label="Main tabs"
          sx={{ bgcolor: '#e2e8f0', boxShadow: 1 }}
        >
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Blank Page" value="blank" />
          <Tab label="Settings" value="settings" />
        </Tabs>

        {/* Content */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'white', overflowY: 'auto' }}>
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "blank" && <BlankPage />}
          {activeTab === "settings" && <Settings />}
        </Box>
      </Box>
    </Box>
  );
}

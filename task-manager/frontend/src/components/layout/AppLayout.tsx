import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Drawer, 
  IconButton, 
  Toolbar, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FormatListBulleted as TasksIcon,
  Category as TaskTypesIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AppLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Task Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/tasks')}>
            <ListItemIcon>
              <TasksIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/tasks/new')}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="New Task" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/task-types')}>
            <ListItemIcon>
              <TaskTypesIcon />
            </ListItemIcon>
            <ListItemText primary="Task Types" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Task Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout; 
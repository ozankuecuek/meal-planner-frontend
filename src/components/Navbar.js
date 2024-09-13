// src/components/Navbar.js

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'; // Burger menu icon
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link as RouterLink } from 'react-router-dom'; // Use RouterLink for routing
import useMediaQuery from '@mui/material/useMediaQuery'; // For responsiveness
import { useTheme } from '@mui/material/styles'; // To access the current theme
import ListItemText from '@mui/material/ListItemText'; // For better list item text

function Navbar() {
  const [user] = useAuthState(auth); // Check authentication status
  const [drawerOpen, setDrawerOpen] = useState(false); // For managing the burger menu drawer
  const theme = useTheme(); // To access the theme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Media query to detect mobile view

  // Function to toggle the drawer (for burger menu)
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Define menu items based on authentication status
  const menuItems = (
    <List>
      {/* Public Links */}
      <ListItem button component={RouterLink} to="/recipes" onClick={toggleDrawer(false)}>
        <ListItemText primary="Recipes" />
      </ListItem>
      <ListItem button component={RouterLink} to="/mealplans/new" onClick={toggleDrawer(false)}>
        <ListItemText primary="Create a Meal Plan" />
      </ListItem>

      {/* Protected Links (only visible to authenticated users) */}
      {user && (
        <>
          <ListItem button component={RouterLink} to="/recipes/new" onClick={toggleDrawer(false)}>
            <ListItemText primary="Create a Recipe" />
          </ListItem>
          <ListItem button component={RouterLink} to="/mealplans" onClick={toggleDrawer(false)}>
            <ListItemText primary="My Meal Plans" />
          </ListItem>
        </>
      )}

      {/* Authentication Button */}
      <ListItem>
        {user ? (
          <Button color="inherit" onClick={() => auth.signOut()}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login" onClick={toggleDrawer(false)}>
            Login
          </Button>
        )}
      </ListItem>
    </List>
  );

  return (
    <>
      {/* AppBar remains sticky */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meal Planner
          </Typography>

          {isMobile ? (
            // Show burger menu on mobile
            <>
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {menuItems}
              </Drawer>
            </>
          ) : (
            // Show regular buttons on desktop
            <>
              {/* Public Links */}
              <Button color="inherit" component={RouterLink} to="/recipes">
                Recipes
              </Button>
              <Button color="inherit" component={RouterLink} to="/mealplans/new">
                Create a Meal Plan
              </Button>

              {/* Protected Links */}
              {user && (
                <>
                  <Button color="inherit" component={RouterLink} to="/recipes/new">
                    Create a Recipe
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/mealplans">
                    My Meal Plans
                  </Button>
                </>
              )}

              {/* Authentication Button */}
              {user ? (
                <Button color="inherit" onClick={() => auth.signOut()}>
                  Logout
                </Button>
              ) : (
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

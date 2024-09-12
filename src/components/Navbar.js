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
import { Link } from 'react-scroll'; // For smooth scrolling
import useMediaQuery from '@mui/material/useMediaQuery'; // For responsiveness
import { useTheme } from '@mui/material/styles'; // To access the current theme

function Navbar() {
  const [user] = useAuthState(auth); // Check authentication status
  const [drawerOpen, setDrawerOpen] = useState(false); // For managing the burger menu drawer
  const theme = useTheme(); // To access the theme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Media query to detect mobile view

  // Function to toggle the drawer (for burger menu)
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = (
    <List>
      <ListItem>
        <Link
          to="create-recipe"
          smooth={true}
          duration={500}
          spy={true}
          offset={-70}
          onClick={toggleDrawer(false)} // Close drawer after clicking
        >
          Create a Recipe
        </Link>
      </ListItem>
      <ListItem>
        <Link
          to="recipes"
          smooth={true}
          duration={500}
          spy={true}
          offset={-70}
          onClick={toggleDrawer(false)}
        >
          Recipes
        </Link>
      </ListItem>
      <ListItem>
        <Link
          to="create-mealplan"
          smooth={true}
          duration={500}
          spy={true}
          offset={-70}
          onClick={toggleDrawer(false)}
        >
          Create a Meal Plan
        </Link>
      </ListItem>
      <ListItem>
        <Link
          to="mealplans"
          smooth={true}
          duration={500}
          spy={true}
          offset={-70}
          onClick={toggleDrawer(false)}
        >
          My Meal Plans
        </Link>
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
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {menuItems}
                <ListItem>
                  {user ? (
                    <Button color="inherit" onClick={() => auth.signOut()}>
                      Logout
                    </Button>
                  ) : (
                    <Button color="inherit">Login</Button>
                  )}
                </ListItem>
              </Drawer>
            </>
          ) : (
            // Show regular buttons on desktop
            <>
              {user && (
                <>
                  <Button color="inherit">
                    <Link
                      to="create-recipe"
                      smooth={true}
                      duration={500}
                      spy={true}
                      offset={-70}
                    >
                      Create a Recipe
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link
                      to="recipes"
                      smooth={true}
                      duration={500}
                      spy={true}
                      offset={-70}
                    >
                      Recipes
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link
                      to="create-mealplan"
                      smooth={true}
                      duration={500}
                      spy={true}
                      offset={-70}
                    >
                      Create a Meal Plan
                    </Link>
                  </Button>
                  <Button color="inherit">
                    <Link
                      to="mealplans"
                      smooth={true}
                      duration={500}
                      spy={true}
                      offset={-70}
                    >
                      My Meal Plans
                    </Link>
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={() => auth.signOut()}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

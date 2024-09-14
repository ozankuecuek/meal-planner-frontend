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
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

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
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={RouterLink} to="/rezepte" onClick={toggleDrawer(false)}>
          <ListItemText primary="Rezepte" />
        </ListItem>
        <ListItem button component={RouterLink} to="/essensplaene/neu" onClick={toggleDrawer(false)}>
          <ListItemText primary="Versorgungsplan erstellen" />
        </ListItem>

        {user && (
          <>
            <Divider />
            <ListItem button component={RouterLink} to="/rezepte/neu" onClick={toggleDrawer(false)}>
              <ListItemText primary="Rezept erstellen" />
            </ListItem>
            <ListItem button component={RouterLink} to="/essensplaene" onClick={toggleDrawer(false)}>
              <ListItemText primary="Meine Versorgungspläne" />
            </ListItem>
          </>
        )}

        <Divider />
        <ListItem>
          {user ? (
            <Button fullWidth variant="outlined" color="inherit" onClick={() => auth.signOut()}>
              Abmelden
            </Button>
          ) : (
            <Button fullWidth variant="outlined" color="inherit" component={RouterLink} to="/anmelden" onClick={toggleDrawer(false)}>
              Anmelden
            </Button>
          )}
        </ListItem>
      </List>
    </Box>
  );

  const MultiLineButton = ({ to, children }) => (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      sx={{
        mx: 1,
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Left-align the text
        textAlign: 'left',
        lineHeight: 1.2,
        minWidth: 'auto',
        padding: '6px 8px',
      }}
    >
      {children.split(' ').map((word, index) => (
        <span key={index}>{word}</span>
      ))}
    </Button>
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <div style={{ display: 'flex', alignItems: 'baseline', flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ mr: 1 }}>
            Gruppenverpflegung
          </Typography>
          <Typography variant="subtitle2" component="div" sx={{ fontSize: '0.8rem' }}>
            einfach gemacht
          </Typography>
        </div>

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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexGrow: 1 }}>
            <MultiLineButton to="/rezepte">Rezepte</MultiLineButton>
            <MultiLineButton to="/essensplaene/neu">
              Versorgungsplan erstellen
            </MultiLineButton>

            {user && (
              <>
                <MultiLineButton to="/rezepte/neu">
                  Rezept erstellen
                </MultiLineButton>
                <MultiLineButton to="/essensplaene">
                  Meine Versorgungspläne
                </MultiLineButton>
              </>
            )}

            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

            {user ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => auth.signOut()}
                sx={{ borderColor: 'white' }}
              >
                Abmelden
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/anmelden"
                sx={{ borderColor: 'white' }}
              >
                Anmelden
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

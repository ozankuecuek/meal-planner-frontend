// src/components/Navbar.js

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon'; // Add this import
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Link as RouterLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListIcon from '@mui/icons-material/List';

function Navbar() {
  const [user] = useAuthState(auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const MultiLineButton = ({ to, children, icon }) => (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      startIcon={icon}
      sx={{
        mx: 1,
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left',
        lineHeight: 1.2,
        minWidth: 'auto',
        padding: '8px 16px',
        borderRadius: '20px',
        transition: 'all 0.3s',
      }}
    >
      <Typography variant="body2">{children}</Typography>
    </Button>
  );

  const menuItems = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={RouterLink} to="/rezepte" onClick={toggleDrawer(false)}>
          <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
          <ListItemText primary="Rezepte" />
        </ListItem>
        <ListItem button component={RouterLink} to="/essensplaene/neu" onClick={toggleDrawer(false)}>
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Versorgungsplan erstellen" />
        </ListItem>

        {user && (
          <>
            <Divider />
            <ListItem button component={RouterLink} to="/rezepte/neu" onClick={toggleDrawer(false)}>
              <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
              <ListItemText primary="Rezept erstellen" />
            </ListItem>
            <ListItem button component={RouterLink} to="/essensplaene" onClick={toggleDrawer(false)}>
              <ListItemIcon><ListIcon /></ListItemIcon>
              <ListItemText primary="Meine Versorgungspläne" />
            </ListItem>
          </>
        )}

        <Divider />
        <ListItem>
          {user ? (
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => auth.signOut()}
              sx={{
                ml: 2,
                borderRadius: '20px',
                textTransform: 'none',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Abmelden
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/anmelden"
              onClick={toggleDrawer(false)}
              sx={{
                ml: 2,
                borderRadius: '20px',
                textTransform: 'none',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              Anmelden
            </Button>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ mr: 1, fontWeight: 'bold' }}>
            Gruppenverpflegung
          </Typography>
          <Typography variant="subtitle2" component="div" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
            einfach gemacht
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              {menuItems}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
            <MultiLineButton to="/rezepte" icon={<RestaurantMenuIcon />}>Rezepte</MultiLineButton>
            <MultiLineButton to="/essensplaene/neu" icon={<CalendarTodayIcon />}>
              Versorgungsplan erstellen
            </MultiLineButton>

            {user && (
              <>
                <MultiLineButton to="/rezepte/neu" icon={<AddCircleOutlineIcon />}>
                  Rezept erstellen
                </MultiLineButton>
                <MultiLineButton to="/essensplaene" icon={<ListIcon />}>
                  Meine Versorgungspläne
                </MultiLineButton>
              </>
            )}

            {user ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => auth.signOut()}
                sx={{
                  ml: 2,
                  borderRadius: '20px',
                  textTransform: 'none',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
              >
                Abmelden
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/anmelden"
                sx={{
                  ml: 2,
                  borderRadius: '20px',
                  textTransform: 'none',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                  },
                }}
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

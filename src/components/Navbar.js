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
import ListItemIcon from '@mui/material/ListItemIcon';
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
import { keyframes } from '@mui/system';

function Navbar() {
  const [user] = useAuthState(auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const spin = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  const NavButton = ({ to, children }) => (
    <Button
      color="inherit"
      component={RouterLink}
      to={to}
      sx={{
        mx: 1,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9rem',
        padding: '6px 12px',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '2px',
          backgroundColor: 'white',
          transform: 'scaleX(0)',
          transformOrigin: 'bottom right',
          transition: 'transform 0.3s ease-out',
        },
        '&:hover::after': {
          transform: 'scaleX(1)',
          transformOrigin: 'bottom left',
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {children}
    </Button>
  );

  const menuItems = (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1 }}>
        <ListItem>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gruppenverpflegung
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="subtitle2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            einfach gemacht
          </Typography>
        </ListItem>
        <Divider sx={{ my: 2 }} />
        <ListItem button component={RouterLink} to="/rezepte" onClick={toggleDrawer(false)}>
          <ListItemIcon><RestaurantMenuIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Rezepte" />
        </ListItem>
        <ListItem button component={RouterLink} to="/essensplaene/neu" onClick={toggleDrawer(false)}>
          <ListItemIcon><CalendarTodayIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Versorgungsplan erstellen" />
        </ListItem>

        {user && (
          <>
            <Divider sx={{ my: 2 }} />
            <ListItem button component={RouterLink} to="/rezepte/neu" onClick={toggleDrawer(false)}>
              <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Rezept erstellen" />
            </ListItem>
            <ListItem button component={RouterLink} to="/essensplaene" onClick={toggleDrawer(false)}>
              <ListItemIcon><ListIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Meine Versorgungspläne" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {user ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              auth.signOut();
              toggleDrawer(false)();
            }}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Abmelden
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/anmelden"
            onClick={toggleDrawer(false)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Anmelden
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#ff7e9a' }}>
      <Toolbar sx={{ minHeight: '64px', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/favicon.ico"
              alt="Logo"
              sx={{
                width: '32px',
                height: '32px',
                marginRight: '16px',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  animation: `${spin} 2s linear infinite`,
                },
                cursor: 'pointer',
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 700, 
                color: '#ffffff', 
                letterSpacing: '0.5px',
                lineHeight: 1.2
              }}>
                Gruppenverpflegung
              </Typography>
              <Typography variant="caption" component="div" sx={{ 
                fontStyle: 'italic', 
                color: 'rgba(255, 255, 255, 0.8)',
                marginTop: '-2px'
              }}>
                einfach gemacht
              </Typography>
            </Box>
          </RouterLink>
        </Box>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)} aria-label="menu" sx={{ ml: 1 }}>
              <MenuIcon sx={{ color: '#ffffff' }} />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  backgroundColor: '#f5f5f5',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              {menuItems}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <NavButton to="/rezepte">Rezepte</NavButton>
            <NavButton to="/essensplaene/neu">Versorgungsplan erstellen</NavButton>

            {user && (
              <>
                <NavButton to="/rezepte/neu">Rezept erstellen</NavButton>
                <NavButton to="/essensplaene">Meine Versorgungspläne</NavButton>
              </>
            )}

            {user ? (
              <Button
                color="inherit"
                onClick={() => auth.signOut()}
                sx={{
                  ml: 2,
                  textTransform: 'none',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease-out',
                }}
              >
                Abmelden
              </Button>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/anmelden"
                sx={{
                  ml: 2,
                  textTransform: 'none',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease-out',
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

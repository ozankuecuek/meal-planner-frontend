import React from 'react';
import { Box, Typography, Button, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const FeatureCard = ({ icon, title, description, link }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Box
      component={RouterLink}
      to={link}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: 3,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ mb: 1, color: 'primary.main' }}>{icon}</Box>
      <Typography 
        variant="subtitle1" 
        component="h3"
        gutterBottom
        sx={{
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </motion.div>
);

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <Box sx={{ pt: isMobile ? 3 : 12, pb: isMobile ? 3 : 8 }}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              component="h1"
              variant={isMobile ? "h4" : "h1"}
              align="center"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: isMobile ? 2 : 4 }}
            >
              Gruppenverpflegung
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography 
              variant={isMobile ? "body2" : "h4"} 
              align="center" 
              color="text.secondary" 
              paragraph
              sx={{ mb: isMobile ? 2 : 4, maxWidth: '800px', mx: 'auto' }}
            >
              Einfach und effizient Mahlzeiten für Gruppen planen
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              justifyContent: 'center',
              alignItems: 'center', 
              gap: 2 
            }}>
              <Button
                component={RouterLink}
                to="/essensplaene/neu"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                sx={{ minWidth: isMobile ? '100%' : '200px' }}
              >
                Jetzt planen
              </Button>
              <Button
                component={RouterLink}
                to="/rezepte"
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                sx={{ minWidth: isMobile ? '100%' : '200px' }}
              >
                Rezepte entdecken
              </Button>
            </Box>
          </motion.div>
        </Box>
        <Grid container spacing={isMobile ? 2 : 4} sx={{ mt: isMobile ? 1 : 8 }}>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<RestaurantMenuIcon fontSize={isMobile ? "medium" : "large"} />}
              title="Vielfältige Rezepte"
              description="Entdecken Sie eine große Auswahl an Rezepten für jede Gelegenheit und jeden Geschmack."
              link="/rezepte"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<CalendarTodayIcon fontSize={isMobile ? "medium" : "large"} />}
              title="Einfache Planung"
              description="Erstellen Sie mühelos Mahlzeitenpläne für Ihre Gruppe und sparen Sie Zeit bei der Organisation."
              link="/essensplaene/neu"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard
              icon={<ShoppingCartIcon fontSize={isMobile ? "medium" : "large"} />}
              title="Automatische Einkaufslisten"
              description="Generieren Sie automatisch Einkaufslisten basierend auf Ihren Mahlzeitenplänen."
              link="/essensplaene/neu"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
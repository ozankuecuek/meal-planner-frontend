import React from 'react';
import { Typography, Container } from '@mui/material';

const Datenschutz = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Datenschutzerklärung</Typography>
      <Typography paragraph>
        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </Typography>
      <Typography variant="h6" gutterBottom>Datenerfassung auf unserer Website</Typography>
      <Typography paragraph>
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
      </Typography>
      <Typography variant="h6" gutterBottom>Wie erfassen wir Ihre Daten?</Typography>
      <Typography paragraph>
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
      </Typography>
      <Typography paragraph>
        Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
      </Typography>
      <Typography variant="h6" gutterBottom>Wofür nutzen wir Ihre Daten?</Typography>
      <Typography paragraph>
        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
      </Typography>
    </Container>
  );
};

export default Datenschutz;
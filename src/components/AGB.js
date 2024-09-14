import React from 'react';
import { Typography, Container } from '@mui/material';

const AGB = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Allgemeine Geschäftsbedingungen</Typography>
      <Typography variant="h6" gutterBottom>1. Geltungsbereich</Typography>
      <Typography paragraph>
        Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der kostenlosen Dienstleistungen der Gruppenverpflegung (nachfolgend "Anbieter") durch ihre Nutzer (nachfolgend "Nutzer").
      </Typography>
      <Typography variant="h6" gutterBottom>2. Leistungsbeschreibung</Typography>
      <Typography paragraph>
        Der Anbieter stellt eine kostenlose Plattform zur Verfügung, die es Nutzern ermöglicht, Rezepte und Mahlzeitenpläne zu generieren. Die Darstellung der Dienste auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Einladung zur Nutzung der Services.
      </Typography>
      <Typography variant="h6" gutterBottom>3. Nutzungsbedingungen</Typography>
      <Typography paragraph>
        Die Nutzung der Dienste ist kostenlos. Der Anbieter behält sich das Recht vor, den Umfang der angebotenen Dienste jederzeit zu ändern oder einzustellen. Ein Anspruch auf ständige Verfügbarkeit der Dienste besteht nicht.
      </Typography>
      <Typography variant="h6" gutterBottom>4. Haftungsausschluss</Typography>
      <Typography paragraph>
        Der Anbieter übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen und Rezepte. Die Nutzung der generierten Rezepte und Mahlzeitenpläne erfolgt auf eigene Gefahr des Nutzers.
      </Typography>
      <Typography variant="h6" gutterBottom>5. Datenschutz</Typography>
      <Typography paragraph>
        Der Anbieter verpflichtet sich, die personenbezogenen Daten der Nutzer gemäß den geltenden Datenschutzbestimmungen zu behandeln. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
      </Typography>
    </Container>
  );
};

export default AGB;
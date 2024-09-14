import React from 'react';
import { Typography, Container } from '@mui/material';

const Widerrufsbelehrung = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Widerrufsbelehrung</Typography>
      <Typography variant="h6" gutterBottom>Widerrufsrecht</Typography>
      <Typography paragraph>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen Ihre Nutzungsvereinbarung zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag der Anmeldung für unseren Service.
      </Typography>
      <Typography paragraph>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (ozan.kuecuek@gmail.com) mittels einer eindeutigen Erklärung (z.B. eine E-Mail) über Ihren Entschluss, diese Nutzungsvereinbarung zu widerrufen, informieren.
      </Typography>
      <Typography variant="h6" gutterBottom>Folgen des Widerrufs</Typography>
      <Typography paragraph>
        Wenn Sie diese Nutzungsvereinbarung widerrufen, werden wir alle von Ihnen erhaltenen personenbezogenen Daten unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag löschen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.
      </Typography>
      <Typography paragraph>
        Die Nutzung unseres kostenlosen Services wird mit sofortiger Wirkung beendet. Bitte beachten Sie, dass bereits erstellte Inhalte oder gespeicherte Informationen möglicherweise nicht wiederhergestellt werden können.
      </Typography>
    </Container>
  );
};

export default Widerrufsbelehrung;
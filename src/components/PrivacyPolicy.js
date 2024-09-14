import React from 'react';
import { Typography, Container } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Datenschutzerklärung
      </Typography>
      <Typography variant="h6" gutterBottom>
        1. Datenschutz auf einen Blick
      </Typography>
      <Typography paragraph>
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </Typography>
      <Typography variant="h6" gutterBottom>
        2. Cookies
      </Typography>
      <Typography paragraph>
        Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </Typography>
      <Typography paragraph>
        Einige Cookies sind "Session-Cookies." Solche Cookies werden nach Ende Ihrer Browser-Sitzung von selbst gelöscht. Hingegen bleiben andere Cookies auf Ihrem Endgerät bestehen, bis Sie diese selbst löschen. Solche Cookies helfen uns, Sie bei Rückkehr auf unserer Website wiederzuerkennen.
      </Typography>
      <Typography paragraph>
        Mit einem modernen Webbrowser können Sie das Setzen von Cookies überwachen, einschränken oder unterbinden. Viele Webbrowser lassen sich so konfigurieren, dass Cookies mit dem Schließen des Programms von selbst gelöscht werden. Die Deaktivierung von Cookies kann eine eingeschränkte Funktionalität unserer Website zur Folge haben.
      </Typography>
      <Typography variant="h6" gutterBottom>
        3. Analytische Cookies
      </Typography>
      <Typography paragraph>
        Wir nutzen analytische Cookies, um die Nutzung unserer Website zu analysieren und unseren Service kontinuierlich zu verbessern. Wir verwenden dafür Firebase Analytics. Diese Cookies ermöglichen es uns, die Anzahl der Besucher und die Herkunft der Besucher zu sehen und zu analysieren, wie Besucher sich auf unserer Website bewegen.
      </Typography>
      <Typography paragraph>
        Die durch diese Cookies gesammelten Informationen werden anonymisiert und in aggregierter Form verwendet. Sie können der Nutzung dieser Cookies widersprechen, indem Sie die Cookie-Einstellungen in Ihrem Browser entsprechend anpassen oder die Cookie-Banner-Option "Ablehnen" wählen.
      </Typography>
      <Typography variant="h6" gutterBottom>
        4. Ihre Rechte
      </Typography>
      <Typography paragraph>
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;

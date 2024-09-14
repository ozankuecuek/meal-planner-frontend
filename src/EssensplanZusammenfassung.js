import React from 'react';
import { Typography, Paper } from '@mui/material';

const EssensplanZusammenfassung = ({ essensplanId, essensplanDaten, einkaufsliste, rezepte }) => {
  // Hilfsfunktion, um Rezepttitel anhand der ID zu erhalten
  const getRezeptTitelNachId = (id) => {
    const rezept = rezepte.find((r) => r.id === id);
    return rezept ? rezept.title : 'Keine Auswahl';
  };

  return (
    <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h5">{essensplanDaten.name}</Typography>

      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Essensplan
      </Typography>
      {Object.keys(essensplanDaten.meals).map((tagKey, index) => {
        const tagesMahlzeiten = essensplanDaten.meals[tagKey];
        return (
          <div key={index} style={{ marginTop: '8px' }}>
            <Typography variant="subtitle1">{`Tag ${index + 1}`}</Typography>
            <Typography variant="body2">Frühstück: {getRezeptTitelNachId(tagesMahlzeiten.breakfast)}</Typography>
            <Typography variant="body2">Mittagessen: {getRezeptTitelNachId(tagesMahlzeiten.lunch)}</Typography>
            <Typography variant="body2">Abendessen: {getRezeptTitelNachId(tagesMahlzeiten.dinner)}</Typography>
          </div>
        );
      })}

      <Typography variant="h6" style={{ marginTop: '16px' }}>
        Einkaufsliste
      </Typography>
      <ul>
        {Object.values(einkaufsliste).map((artikel, index) => (
          <li key={index}>
            {artikel.name}: {artikel.quantity} {artikel.unit}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default EssensplanZusammenfassung;
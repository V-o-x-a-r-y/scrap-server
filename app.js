const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 6576;

app.use(cors());
app.use(bodyParser.json());

let storedLinks = []; // Variable globale pour stocker les liens

// Charger le certificat SSL
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

app.post('/html', (req, res) => {
  const html = req.body;

  // Vérifiez si le lien existe déjà dans la liste
  if (!storedLinks.includes(html)) {
    // Ajoutez le nouveau lien à la liste des liens stockés
    storedLinks.push(html);
    console.log('Liens stockés:', storedLinks);
    res.send('Liens reçus et stockés avec succès !');
  } else {
    console.log('Le lien existe déjà dans la liste.');
    res.status(400).send('Le lien existe déjà dans la liste.');
  }
});

// Route pour récupérer les liens stockés
app.get('/links', (req, res) => {
  res.json({ links: storedLinks });
});

app.get('/reset', (req, res) => {
  storedLinks = []; // Réinitialiser la variable globale storedLinks en affectant un tableau vide
  res.send('Liens réinitialisés avec succès !');
});

// Créer un serveur HTTPS
https.createServer(options, app).listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connexion à la base de données établie');
    }
});

app.get('/api/personnes', (req, res) => {
    db.query('SELECT id FROM personnes', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const references = results.map(personne => {
            return `/personne/${personne.id}`;
        });

        res.json({ references });
    });
});

app.get('/api/personne/:id', (req, res) => {
    const personneId = req.params.id;
    db.query('SELECT * FROM personnes WHERE id = ?', [personneId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Personne non trouvée.' });
            return;
        }
        res.json({ personne: results[0] });
    });
});

app.post('/api/ajouter-personne', (req, res) => {
    const { nom, prenom } = req.body;

    if (!nom || !prenom) {
        return res.status(400).json({ success: false, error: 'Veuillez fournir tous les champs (nom, prénom).' });
    }

    db.query('INSERT INTO personnes (nom, prenom) VALUES (?, ?)', [nom, prenom], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        return res.status(201).json({ success: true, id: results.insertId, nom, prenom });
    });
});

app.put('/api/maj-personne/:id', (req, res) => {
    const personneId = req.params.id;
    const { nom, prenom } = req.body;

    if (!nom || !prenom) {
        return res.status(400).json({ success: false, error: 'Veuillez fournir tous les champs (nom, prénom).' });
    }

    db.query('UPDATE personnes SET nom = ?, prenom = ? WHERE id = ?', [nom, prenom, personneId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Personne non trouvée.' });
        }

        return res.json({ success: true, message: 'Personne mise à jour avec succès.' });
    });
});

app.delete('/api/supprimer-personne/:id', (req, res) => {
    const personneId = req.params.id;

    db.query('DELETE FROM personnes WHERE id = ?', [personneId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Personne non trouvée.' });
        }

        return res.json({ success: true, message: 'Personne supprimée avec succès.' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

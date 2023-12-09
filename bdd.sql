-- Création de la base de données "data"
CREATE DATABASE IF NOT EXISTS data;

-- Utilisation de la base de données "data"
USE data;

-- Création de la table "personnes" sans l'attribut "email"
CREATE TABLE IF NOT EXISTS personnes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL
);

-- Insertion de données fictives
INSERT INTO personnes (nom, prenom) VALUES
    ('Doe', 'John'),
    ('Smith', 'Jane'),
    ('Johnson', 'Bob');

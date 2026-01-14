const express = require('express');
const router = express.Router();
const fs = require('fs');
const rdf = require('rdflib');

// Namespaces
const FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/");
const M2 = rdf.Namespace("https://m2.fr/rdf#");

// Lire le fichier RDF
const rdfData = fs.readFileSync('data/tp.rdf', 'utf8');

// Créer un store RDF et parser le fichier
const store = rdf.graph();
const contentType = 'application/rdf+xml';
const baseUrl = M2().value;

rdf.parse(rdfData, store, baseUrl, contentType);

// Liste de toutes les propriétés à prendre en compte
const toutesProprietes = [
    "aGenre", 
    "aContinent", 
    "aEpoque", 
    "aProfession", 
    "aMort", 
    "aReligion", 
    "aVecuEnMemeTempsQue"
];

// Helper : récupérer toutes les propriétés d'un personnage
function getProprietes(personne) {
    const props = {};
    toutesProprietes.forEach(prop => {
        const values = store.each(personne, M2(prop), undefined).map(v => v.value);
        if (values.length) props[prop] = values;
    });
    return props;
}

// Helper : choisir n éléments aléatoires d'un tableau
function sampleArray(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

// Vérifie si une valeur est unique parmi les autres personnages
function isUnique(key, val, autresPersonnages) {
    return !autresPersonnages.some(p => {
        const vals = getProprietes(p)[key] || [];
        return vals.includes(val);
    });
}

// Générer l'indice unique pour 3 personnages
function genererIndice(troisPersonnages, autresPersonnages) {
    const propsList = troisPersonnages.map(p => getProprietes(p));
    const indices = [];

    // Pour chaque propriété
    toutesProprietes.forEach(key => {
        // Intersection des valeurs pour les 3 personnages
        const commun = propsList
            .map(p => p[key] || [])
            .reduce((a, b) => a.filter(v => b.includes(v)));

        // Vérifier que cette valeur est unique par rapport aux autres personnages
        commun.forEach(val => {
            if (isUnique(key, val, autresPersonnages)) {
                indices.push(`${key.replace('a', '')}: ${val}`);
            }
        });
    });

    return indices.join(", ") || "Indice introuvable";
}

// Route pour générer le jeu
router.get('/lunch-game', (req, res) => {
    // Récupérer tous les personnages
    const allPersonnages = store.each(undefined, FOAF("name"), undefined);

    // Choisir 10 personnages aléatoires
    const dixPersos = sampleArray(allPersonnages, 10);

    // Chercher 3 personnages avec combinaison unique
    let trioTrouve = null;
    for (let i = 0; i < 1000; i++) { // max 1000 essais
        const trois = sampleArray(dixPersos, 3);
        const autres = dixPersos.filter(p => !trois.includes(p));
        const indiceText = genererIndice(trois, autres);
        if (indiceText !== "Indice introuvable") {
            trioTrouve = { trois, autres, indiceText };
            break;
        }
    }

    if (!trioTrouve) return res.status(500).send({ error: "Impossible de générer un indice unique" });

    // Créer la réponse attendue par le front
    const personnagesData = dixPersos.map((p, idx) => ({
        id: idx,
        name: store.any(p, FOAF("name")).value
    }));

    const indices = trioTrouve.trois.map(p => personnagesData.findIndex(pd => pd.name === store.any(p, FOAF("name")).value));

    res.json({
        personnages: personnagesData,
        indices,
        indiceText: trioTrouve.indiceText
    });
});

module.exports = router;

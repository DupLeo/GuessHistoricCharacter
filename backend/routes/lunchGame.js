const express = require('express');
const router = express.Router();
const fs = require('fs');
const rdf = require('rdflib');

const datas =
    {
        personnages : ["Cleopatre","Albert Einstein", "Jeanne d'Arc", "Gengis Khan", "Kubilai Khan", "Marco Polo", "Frida Kahlo", "Martin Luther King Jr.", "Nikola Tesla", "Napoléon Bonaparte", "Anne Frank", "Marie Curie", "César", "Vercingétorix", "Alexandre le Grand", "Qin Shi Huang"],
        indice : {
            mot : "Egypte",
            indexs : [0,12,15]
        }
    };

// Définir les namespaces
const FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/");
const M2 = rdf.Namespace("https://m2.fr/rdf#");

// Lire le fichier RDF
const rdfData = fs.readFileSync('data/tp.rdf').toString();

// Créer un store RDF et parser le fichier
const store = rdf.graph();
const contentType = 'application/rdf+xml';
const baseUrl = M2().value;

rdf.parse(rdfData, store, baseUrl, contentType);

// Fonction pour extraire toutes les propriétés d'un personnage
function getProprietes(personnage) {
    const proprietes = {};

    const proprietesAChecker = [
        //{ nom: "Genre", uri: M2("aGenre") },
        //{ nom: "Continent", uri: M2("aContinent") },
        { nom: "Époque", uri: M2("aEpoque") },
        { nom: "Profession", uri: M2("aProfession") },
        //{ nom: "Cause de mort", uri: M2("aMort") },
        { nom: "Religion", uri: M2("aReligion") },
    ];

    proprietesAChecker.forEach(prop => {
        const valeurs = store.each(personnage, prop.uri, undefined);
        if (valeurs.length > 0) {
            proprietes[prop.nom] = valeurs.map(v => v.value.split("#").pop());
        }
    });

    return proprietes;
}

// Fonction pour trouver la propriété la plus commune parmi les personnages sélectionnés
function select_indice(indexes, personnages) {
    if (indexes.length === 0) {
        return "Aucun indice trouvé";
    }

    // Extraire les propriétés de chaque personnage sélectionné
    const proprietesParPersonnage = indexes.map(index => getProprietes(personnages[index]));
    const proprietesCommunes = {};

    // Initialiser le comptage avec les propriétés du premier personnage
    const premierPersonnageProps = proprietesParPersonnage[0];
    Object.keys(premierPersonnageProps).forEach(prop => {
        proprietesCommunes[prop] = 1;
    });

    // Comparer avec les autres personnages
    for (let i = 1; i < proprietesParPersonnage.length; i++) {
        const propsActuelles = proprietesParPersonnage[i];
        Object.keys(propsActuelles).forEach(prop => {
            // Vérifier si la propriété existe dans le premier personnage
            if (premierPersonnageProps[prop]) {
                // Vérifier si au moins une valeur est commune
                const intersection = premierPersonnageProps[prop].filter(val =>
                    propsActuelles[prop].includes(val)
                );
                if (intersection.length > 0) {
                    proprietesCommunes[prop]++;
                }
            }
        });
    }

    // Trouver la propriété avec le plus grand nombre d'occurrences
    let indice = "Aucun indice trouvé";
    let maxOccurrences = 0;

    Object.keys(proprietesCommunes).forEach(prop => {
        if (proprietesCommunes[prop] > maxOccurrences) {
            maxOccurrences = proprietesCommunes[prop];
            indice = prop;
        }
    });

    return indice;
}

// Exemple d'utilisation
const personnages = store.each(undefined, FOAF("name"), undefined);
const indexes = [0, 4, 15, 14];
const resultat = select_indice(indexes, personnages);
console.log("Personnages selectionnées :")
indexes.forEach(index => {
    console.log(getProprietes(personnages[index]))
    console.log("- ",personnages[index].value);
})
console.log("Indice :", resultat);









// Route pour la page d'accueil
router.get('/lunch-game', (req, res) => {
    res.send(datas);
});

module.exports = router;

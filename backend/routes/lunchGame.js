const express = require('express');
const router = express.Router();
const fs = require('fs');
const rdf = require('rdflib');

const FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/");
const M2 = rdf.Namespace("https://m2.fr/rdf#");

const rdfData = fs.readFileSync('data/tp.rdf', 'utf8');
const store = rdf.graph();
const contentType = 'application/rdf+xml';
const baseUrl = M2().value;
rdf.parse(rdfData, store, baseUrl, contentType);

const toutesProprietes = [
    "aGenre",
    "aContinent",
    "aEpoque",
    "aProfession",
    "aMort",
    "aReligion",
    "aVecuEnMemeTempsQue"
];

const prioriteProprietes = [
    "aMort",
    "aVecuEnMemeTempsQue",
    "aProfession",
    "aReligion",
    "aEpoque",
    "aContinent",
    "aGenre"
];

function getSuperClasses(cls) {
    const supers = new Set();
    const directSupers = store.each(cls, rdf.sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"), undefined);
    directSupers.forEach(s => {
        supers.add(s.value);
        getSuperClasses(s).forEach(ss => supers.add(ss));
    });
    return supers;
}

function getProprietes(personne) {
    const props = {};
    toutesProprietes.forEach(prop => {
        const values = store.each(personne, M2(prop), undefined).map(v => {
            return [v.value, ...Array.from(getSuperClasses(v))];
        }).flat();
        if (values.length) props[prop] = [...new Set(values)];
    });
    return props;
}

function sampleArray(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

function isUnique(key, val, autresPersonnages) {
    return !autresPersonnages.some(p => {
        const vals = getProprietes(p)[key] || [];
        return vals.includes(val);
    });
}

function genererIndice(trio, autresPersonnages) {
    const propsList = trio.map(p => getProprietes(p));

    // combinaison de 2 indices prioritaire
    for (let i = 0; i < prioriteProprietes.length; i++) {
        for (let j = i + 1; j < prioriteProprietes.length; j++) {
            const key1 = prioriteProprietes[i];
            const key2 = prioriteProprietes[j];

            const commun1 = propsList.map(p => p[key1] || []).reduce((a,b) => a.filter(v => b.includes(v)), propsList[0][key1] || []);
            const commun2 = propsList.map(p => p[key2] || []).reduce((a,b) => a.filter(v => b.includes(v)), propsList[0][key2] || []);

            for (let v1 of commun1) {
                for (let v2 of commun2) {
                    if (isUnique(key1, v1, autresPersonnages) && isUnique(key2, v2, autresPersonnages)) {
                        return `${key1.replace('a','')}: ${v1}, ${key2.replace('a','')}: ${v2}`;
                    }
                }
            }
        }
    }

    // 1 indice si 2 indices impossible
    for (let key of prioriteProprietes) {
        const commun = propsList.map(p => p[key] || []).reduce((a,b) => a.filter(v => b.includes(v)), propsList[0][key] || []);
        for (let val of commun) {
            if (isUnique(key, val, autresPersonnages)) {
                return `${key.replace('a','')}: ${val}`;
            }
        }
    }

    return null;
}

router.get('/lunch-game', (req, res) => {
    const allPersonnages = store.each(undefined, FOAF("name"), undefined);

    let trioTrouve = null;
    let tentatives = 0;

    while (!trioTrouve && tentatives < 1000) {
        tentatives++;

        const dixPersos = sampleArray(allPersonnages, 14);

        for (let i = 0; i < 200; i++) {

            // Probabilité : 2 persos 20%, 3 persos 40%, 4 persos 40%
            const rand = Math.random();
            let trioSize;
            if (rand < 0.2) trioSize = 2;
            else if (rand < 0.6) trioSize = 3;
            else trioSize = 4;

            const trio = sampleArray(dixPersos, trioSize);
            const autres = dixPersos.filter(p => !trio.includes(p));
            const indiceText = genererIndice(trio, autres);

            if (indiceText) {
                trioTrouve = { trio, autres, indiceText, dixPersos };
                break;
            }
        }
    }

    if (!trioTrouve) {
        return res.status(500).send({ error: "Impossible de générer un indice unique" });
    }

    const personnagesData = trioTrouve.dixPersos.map((p, idx) => ({
        id: idx,
        name: store.any(p, FOAF("name")).value
    }));

    const indices = trioTrouve.trio.map(p => personnagesData.findIndex(pd => pd.name === store.any(p, FOAF("name")).value));

    res.json({
        personnages: personnagesData,
        indices,
        indiceText: trioTrouve.indiceText
    });
});

module.exports = router;

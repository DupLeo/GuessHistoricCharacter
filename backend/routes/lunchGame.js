const express = require('express');
const router = express.Router();

const datas =
    {
        personnages : ["Cleopatre","Albert Einstein", "Jeanne d'Arc", "Gengis Khan", "Kubilai Khan", "Marco Polo", "Frida Kahlo", "Martin Luther King Jr.", "Nikola Tesla", "Napoléon Bonaparte", "Anne Frank", "Marie Curie", "César", "Vercingétorix", "Alexandre le Grand", "Qin Shi Huang"],
        indice : {
            mot : "Egypte",
            indexs : [0,12,15]
        }
    }

// Route pour la page d'accueil
router.get('/lunch-game', (req, res) => {
    res.send(datas);
});

module.exports = router;

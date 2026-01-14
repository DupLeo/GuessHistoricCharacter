const express = require('express');
const app = express();
const cors = require('cors')
const routes = require('./routes/lunchGame');
const PORT = 3000;

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

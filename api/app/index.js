const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authenticateApiKey = require('./middleware/authenticateApiKey');

dotenv.config();

const app = express();
const port = process.env.EXP_PORT || 3000;
const address = process.env.EXP_ADDR || 'localhost';

app.use(express.json());
const logRequest = require(__dirname + '/middleware/logger');
app.use(logRequest);

// Load routes from the private and public folders
const routeFolders = ['private', 'public'];

routeFolders.forEach((folder) => {
  const routePath = path.join(__dirname, 'routes', folder);

  fs.readdirSync(routePath).forEach((file) => {
    const routeFilePath = path.join(routePath, file);
    const route = require(routeFilePath);
    const fileName = path.parse(file).name;
    if (folder === 'private') {
      app.use(`/${folder}/${fileName}`, authenticateApiKey, route);
    } else {
      app.use(`/${folder}/${fileName}`, route);
    }
  });

  if (folder === 'private') {
    const privateRoutes = fs.readdirSync(routePath).map((file) => {
      const routeFileName = path.parse(file).name;
      return `/${folder}/${routeFileName}`;
    });

    app.get(`/${folder}`, (req, res) => {
      res.json({ routes: privateRoutes });
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

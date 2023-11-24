const express = require('express');
const cors = require('cors');

const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const logger = require('./middleware/logger');
const authenticateApiKey = require('./middleware/authenticateApiKey');

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(
  cors({
    credentials: false,
  })
);
app.use(express.json());
app.use(logger);

// Loop through the route folders and load the route files dynamically
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

  // Create an endpoint to list all private routes
  if (folder === 'private') {
    const privateRoutes = fs.readdirSync(routePath).map((file) => {
      const routeFileName = path.parse(file).name;
      return `/${folder}/${routeFileName}`;
    });
    // Create an endpoint to list all public routes
    app.get(`/${folder}`, (req, res) => {
      res.json({ routes: privateRoutes });
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

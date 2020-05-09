import express from 'express';
import bodyParser from 'body-parser';
import api from './src/api';
import dbManager from './src/db-manager';
import middleware from './src/middleware';
import utility from './src/utility';
import serverConfig from './config/server.json';

// database
dbManager.open();

// express app
const app = express();
const port = serverConfig.port;

// middleware
app.use(bodyParser.json());

// route
app.use('/', api);

// error handler
app.use(middleware.errorHandler);

app.listen(port, () => utility.print(`Server listening on port ${port}...`));

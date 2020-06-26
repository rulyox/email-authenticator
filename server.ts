import express from 'express';
import bodyParser from 'body-parser';
import api from './src/api';
import * as DB from './src/db-manager';
import * as middleware from './src/middleware';
import * as utility from './src/utility';
import serverConfig from './config/server.json';

// database
DB.open();

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

import express from 'express';
import bodyParser from 'body-parser';
import api from './src/api';
import utility from './src/utility';

// express app
const app = express();
const port = 8080;

// middleware
app.use(bodyParser.json());

// route
app.use('/', api);

app.listen(port, () => utility.print(`Server listening on port ${port}...`));

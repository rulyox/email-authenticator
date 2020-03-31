import fs from 'fs';
import path from 'path';
import express from 'express';
import authController from './auth-controller';
import utility from '../utility';
import serverConfig from '../../config/server.json';

const templateEval = (s: string, params: object) => {

    return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));

};

const resultHTMLPath = path.resolve(__dirname, '../../web', 'result.html');

const router = express.Router();

/*
Start authentication and send email.
Key is the password for using this server.
POST /auth/start

request body json
{key: string, title: string, email: string, callback: string}

response json
{result: boolean, code: string}
*/
router.post('/start', async (request, response) => {

    const key = request.body?.key;
    const title = request.body?.title;
    const email = request.body?.email;
    const callback = request.body?.callback;

    // type check
    if(typeof key !== 'string' || typeof title !== 'string' || typeof email !== 'string' || typeof callback !== 'string') {
        response.writeHead(400);
        response.end();
        return;
    }

    // key check
    if(key !== serverConfig.key) {
        response.writeHead(401);
        response.end();
        return;
    }

    let result: {result: boolean, code: string};
    utility.print(`POST /auth/start ${email}`);

    // code is used to identify user
    const code: string = await authController.createCode(email, callback);

    authController.sendEmail(title, email, code);

    result = {
        result: true,
        code: code
    };

    response.json(result);

});

/*
User should click this link to authenticate.
GET /auth/:code

request param
code : string
*/
router.get('/:code', async (request, response) => {

    const code = request.params?.code;

    // type check
    if(typeof code !== 'string') {
        response.writeHead(400);
        response.end();
        return;
    }

    utility.print(`GET /auth ${code}`);

    const authResult: string = await authController.checkCode(code);

    // create result html
    let resultHTML: string = '`' + fs.readFileSync(resultHTMLPath).toString() + '`';

    if(authResult === 'success') resultHTML = templateEval(resultHTML, {result:'Authentication Successful!'});
    else if(authResult === 'already') resultHTML = templateEval(resultHTML, {result:'Already Authenticated!'});
    else if(authResult === 'fail') resultHTML = templateEval(resultHTML, {result:'Authentication Failed!'});

    response.writeHead(200);
    response.end(resultHTML);

});

export default router;

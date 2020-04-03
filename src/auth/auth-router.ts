import fs from 'fs';
import path from 'path';
import express from 'express';
import authController from './auth-controller';
import utility from '../utility';
import serverConfig from '../../config/server.json';

const router = express.Router();

/*
POST /auth/start

Start authentication and send email.
Key is the password for using this server.

Request Body JSON
{key: string, title: string, email: string, callback: string}

Response JSON
{code: string}
*/
router.post('/start', async (request, response, next) => {

    const key = request.body?.key;
    const title = request.body?.title;
    const email = request.body?.email;
    const callback = request.body?.callback;

    // type check
    if(typeof key !== 'string' || typeof title !== 'string' || typeof email !== 'string' || typeof callback !== 'string') {
        response.status(400).end();
        return;
    }

    // key check
    if(key !== serverConfig.key) {
        response.status(401).end();
        return;
    }

    utility.print(`POST /auth/start ${email}`);

    try {

        // code is used to identify user
        const code: string = await authController.createCode(email, callback);

        authController.sendEmail(title, email, code);

        response.json({ code: code });

    } catch(error) {

        // error handler
        next(new Error(`POST /auth/start\n${error}`));

    }

});

/*
GET /auth/:code

User should click this link to authenticate.

Request Param
code : string
*/
router.get('/:code', async (request, response, next) => {

    const code = request.params?.code;

    // type check
    if(typeof code !== 'string') {
        response.status(400).end();
        return;
    }

    utility.print(`GET /auth ${code}`);

    try {

        const authResult: number = await authController.checkCode(code);

        // create result html
        const resultHTMLPath = path.resolve(__dirname, '../../web', 'result.html');
        let resultHTML: string = '`' + fs.readFileSync(resultHTMLPath).toString() + '`';

        if(authResult === 101) resultHTML = utility.templateEval(resultHTML, {result:'Authentication Successful!'});
        else if(authResult === 201) resultHTML = utility.templateEval(resultHTML, {result:'Already Authenticated!'});
        else if(authResult === 202) resultHTML = utility.templateEval(resultHTML, {result:'Authentication Failed!'});

        response.status(200).end(resultHTML);

    } catch(error) {

        // error handler
        next(new Error(`GET /auth\n${error}`));

    }

});

export default router;

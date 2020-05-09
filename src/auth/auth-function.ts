import express from 'express';
import path from 'path';
import fs from 'fs';
import authDAO from './auth-dao';
import awsController from '../aws/aws-controller';
import utility from '../utility';
import serverConfig from '../../config/server.json';

/*
POST /auth/start

Start authentication and send email.
Key is the password for using this server.

Request Body JSON
{key: string, title: string, email: string, callback: string}

Response JSON
{code: string}
*/
const postStart = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const key = request.body.key;
    const title = request.body.title;
    const email = request.body.email;
    const callback = request.body.callback;

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
        const code: string = await authDAO.createCode(email, callback);

        awsController.sendEmail(title, email, code);

        response.json({ code: code });

    } catch(error) { next(error); }

};

/*
GET /auth/:code

User should click this link to authenticate.

Request Param
code : string
*/
const get = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const code = request.params.code;

    // type check
    if(code === null) {
        response.status(400).end();
        return;
    }

    utility.print(`GET /auth ${code}`);

    try {

        const authResult: number = await authDAO.checkCode(code);

        // create result html
        const resultHTMLPath = path.resolve(__dirname, '../../web', 'result.html');
        let resultHTML: string = '`' + fs.readFileSync(resultHTMLPath).toString() + '`';

        if(authResult === 101) resultHTML = utility.evalTemplate(resultHTML, {result:'Authentication Successful!'});
        else if(authResult === 201) resultHTML = utility.evalTemplate(resultHTML, {result:'Already Authenticated!'});
        else if(authResult === 202) resultHTML = utility.evalTemplate(resultHTML, {result:'Authentication Failed!'});

        response.status(200).end(resultHTML);

    } catch(error) { next(error); }

};

export default {
    postStart,
    get
};

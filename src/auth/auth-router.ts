import express from 'express';
import authController from './auth-controller';
import utility from "../utility";

const router = express.Router();

/*
Start authentication and send email
- key is used to identify service
- code is used to check user
POST /auth/start

request body json
{key: string, title: string, recipient: string}

response json
{result: boolean}
*/
router.post('/start', async (request, response) => {

    const key = request.body?.key;
    const title = request.body?.title;
    const recipient = request.body?.recipient;

    // type check
    if(typeof key !== 'string' || typeof title !== 'string' || typeof recipient !== 'string') {
        response.writeHead(400);
        response.end();
        return;
    }

    let result: {result: boolean};
    utility.print(`POST /auth/start ${recipient}`);

    // key check
    const keyResult: boolean = authController.checkKey(key);
    if(!keyResult) {
        response.writeHead(401);
        response.end();
        return;
    }

    const code = authController.createCode(key);

    authController.sendEmail(title, recipient);

    result = {
        result: true
    };

    response.json(result);

});

export default router;

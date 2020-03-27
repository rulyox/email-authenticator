import crypto from 'crypto';
import AWS from 'aws-sdk';
import dbManager from '../db-manager';
import authSQL from './auth-sql';
import awsConfig from '../../config/aws.json';
import emailConfig from '../../config/email.json';
import serverConfig from '../../config/server.json';
import utility from "../utility";

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

const createCode = (recipient: string, callback: string): Promise<string> => {
    return new Promise(async (resolve) => {

        const code = crypto.randomBytes(30).toString('hex');

        const addQuery = await dbManager.queryRunDB(authSQL.addAuth(recipient, code, callback));
        const addedId = addQuery.lastID;

        utility.print(`Added ${addedId} ${code}`);

        resolve(code);

    });
};

const sendEmail = (title: string, recipient: string, code: string) => {

    const authLink = `${serverConfig.host}/auth/${code}`;

    const emailParams = {

        Destination: {
            ToAddresses: [recipient]
        },

        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `${authLink}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `[${title}] Authentication Email`
            }
        },

        Source: emailConfig.sender // "anything@domain" or "email address" in SES Identity Management

    };

    new AWS.SES({apiVersion: '2010-12-01'})
        .sendEmail(emailParams)
        .promise()
        .then(data => console.log(data.MessageId))
        .catch(error => console.error(error, error.stack));

};

const checkCode = (code: string): Promise<boolean> => {
    return new Promise(async (resolve) => {

        const selectQuery = await dbManager.queryAllDB(authSQL.selectAuth(code));

        if(selectQuery.length === 1) {

            const selectedId: number = selectQuery[0].id;

            utility.print(`Selected ${selectedId}`);

            await dbManager.queryAllDB(authSQL.updateAuth(selectedId));

            resolve(true);

        } else {

            resolve(false);

        }

    });
};

export default {
    createCode,
    sendEmail,
    checkCode
};

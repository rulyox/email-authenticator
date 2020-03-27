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

const createCode = (email: string, callback: string): Promise<string> => {
    return new Promise(async (resolve) => {

        const code = crypto.randomBytes(30).toString('hex');

        const addQuery = await dbManager.queryRunDB(authSQL.addAuth(email, code, callback));
        const addedId = addQuery.lastID;

        utility.print(`Added ${addedId} ${code}`);

        resolve(code);

    });
};

const sendEmail = (title: string, email: string, code: string) => {

    const authLink = `${serverConfig.host}/auth/${code}`;

    const emailTitle = `[${title}] Authentication Email`;
    const emailBody = `
    Hello.<br>
    This email was sent for the authentication of ${title}.<br>
    Please click the link below to authenticate.<br>
    <br>
    ${authLink}<br>
    `;

    const emailParams = {

        Destination: {
            ToAddresses: [email]
        },

        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: emailBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: emailTitle
            }
        },

        Source: emailConfig.sender // "anything@domain" or "email address" in SES Identity Management

    };

    new AWS.SES({apiVersion: '2010-12-01'})
        .sendEmail(emailParams)
        .promise()
        .then(data => utility.print(`Email send ${data.MessageId}`))
        .catch(error => utility.print(`Email error ${error}`));

};

const checkCode = (code: string): Promise<boolean> => {
    return new Promise(async (resolve) => {

        const selectQuery = await dbManager.queryAllDB(authSQL.selectAuth(code));

        if(selectQuery.length === 1) {

            const selectedId: number = selectQuery[0].id;

            await dbManager.queryAllDB(authSQL.updateAuth(selectedId));

            utility.print(`Authenticated ${selectedId}`);

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

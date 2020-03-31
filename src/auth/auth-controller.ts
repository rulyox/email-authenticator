import crypto from 'crypto';
import request from 'request';
import AWS from 'aws-sdk';
import dbManager from '../db-manager';
import authSQL from './auth-sql';
import utility from '../utility';
import awsConfig from '../../config/aws.json';
import emailConfig from '../../config/email.json';
import serverConfig from '../../config/server.json';

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

const createCode = (email: string, callback: string): Promise<string> => {
    return new Promise(async (resolve) => {

        const code = crypto.randomBytes(30).toString('hex');

        await dbManager.query(authSQL.add(email, code, callback));

        utility.print(`Started ${code}`);

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
        .then(data => utility.print(`Email Sent ${data.MessageId}`))
        .catch(error => utility.print(`Email Error ${error}`));

};

const checkCode = (code: string): Promise<string> => {
    return new Promise(async (resolve) => {

        const selectQuery = await dbManager.query(authSQL.selectByCode(code));

        if(selectQuery.length === 1) {

            if(selectQuery[0].done === 0) {

                const id: number = selectQuery[0].id;
                const callback: string = selectQuery[0].callback;

                sendCallback(callback);

                // mark done
                await dbManager.query(authSQL.edit(id));

                utility.print(`Authenticated ${id}`);

                resolve('success');

            } else {

                resolve('already');

            }

        } else {

            resolve('fail');

        }

    });
};

const sendCallback = (callback: string) => {

    request({

        method: 'GET',
        url: callback

    }, (error, response) => {

        if(error) utility.print(error);
        else utility.print(`Callback Result ${response.body}`);

    });

};

export default {
    createCode,
    sendEmail,
    checkCode,
    sendCallback
};

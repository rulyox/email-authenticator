import AWS from 'aws-sdk';
import * as utility from '../utility';
import awsConfig from '../../config/aws.json';
import serverConfig from '../../config/server.json';

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

export const sendEmail = (title: string, email: string, code: string) => {

    const authLink = `${serverConfig.host}:${serverConfig.port}/auth/${code}`;

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

        Source: awsConfig.sender // "anything@domain" or "email address" in SES Identity Management

    };

    new AWS.SES({apiVersion: '2010-12-01'})
        .sendEmail(emailParams)
        .promise()
        .then(data => utility.print(`Email Sent\n${data.MessageId}`))
        .catch(error => utility.print(`Email Error\n${error}`));

};

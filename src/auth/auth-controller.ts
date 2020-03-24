import crypto from 'crypto';
import AWS from 'aws-sdk';
import awsConfig from '../../config/aws.json';
import emailConfig from '../../config/email.json';

AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

const checkKey = (key: string): boolean => {

    return true;

};

const createCode = (key: string): string => {

    const code = crypto.randomBytes(20).toString('hex');
    return code;

};

const sendEmail = (title: string, recipient: string) => {

    const emailParams = {

        Destination: {
            ToAddresses: [recipient]
        },

        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: 'hello world'
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

export default {
    checkKey,
    createCode,
    sendEmail
};

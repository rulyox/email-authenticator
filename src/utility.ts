import express from 'express';

const getTime = (): string => {

    const time = new Date();

    const date = ('0' + time.getDate()).slice(-2);
    const month = ('0' + (time.getMonth() + 1)).slice(-2);
    const year = time.getFullYear();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const result = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;

    return result.padEnd(20);

};

const print = (log: string): void => {

    console.log(`${getTime()}| ${log}`);

};

const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    print(`Error\n${error}`);

    response.status(500).end();

};

const templateEval = (s: string, params: object) => {

    return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));

};

export default {
    getTime,
    print,
    errorHandler,
    templateEval
};

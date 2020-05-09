import express from 'express';
import utility from './utility';

const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    utility.print(`Error\n${error}`);

    response.status(500).end();

};

export default {
    errorHandler
};

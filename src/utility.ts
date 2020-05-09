import request from 'request';

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

const requestGet = (callback: string) => {

    request({

        method: 'GET',
        url: callback

    }, (error, response) => {

        if(error) print(`Request Error\n${error}`);
        else print(`Request Result\n${response.body}`);

    });

};

const evalTemplate = (s: string, params: object) => {

    return Function(...Object.keys(params), "return " + s)
    (...Object.values(params));

};

export default {
    getTime,
    print,
    requestGet,
    evalTemplate
};

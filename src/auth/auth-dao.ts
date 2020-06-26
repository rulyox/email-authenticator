import crypto from 'crypto';
import * as DB from '../db-manager';
import * as authSQL from './auth-sql';
import * as utility from '../utility';

export const createCode = (email: string, callback: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        try {

            // create random code
            const code = crypto.randomBytes(30).toString('hex');

            await DB.query(authSQL.add(email, code, callback));

            utility.print(`Started ${code}`);

            resolve(code);

        } catch(error) {

            reject(error);

        }

    });
};

/*
Result Code
101 : Success
201 : Already authenticated
202 : Wrong code
*/
export const checkCode = (code: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectQuery = await DB.query(authSQL.selectByCode(code));

            if(selectQuery.length === 1) {

                if(selectQuery[0].done === 0) {

                    const id: number = selectQuery[0].id;
                    const callback: string = selectQuery[0].callback;

                    // send callback
                    utility.requestGet(callback);

                    // mark code as done
                    await DB.query(authSQL.edit(id));

                    utility.print(`Authenticated ${id}`);

                    resolve(101);

                } else resolve(201); // code already done

            } else resolve(202); // code does not exist

        } catch(error) {

            reject(error);

        }

    });
};

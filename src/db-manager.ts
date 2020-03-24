import path from 'path';
import sqlite from 'sqlite3';
import utility from './utility';

let authDB: sqlite.Database;
const authDBPath = path.resolve(__dirname, '../data', 'auth.db');

const openDB = () => {

    authDB = new sqlite.Database(authDBPath, (error) => {

        if(error) utility.print(error.toString());
        else utility.print('DB Opened');

    });

};

const setupDB = () => {

    const createUserTable = `CREATE TABLE IF NOT EXISTS \`auth\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`email\` TEXT NOT NULL,
        \`code\` TEXT NOT NULL,
        \`callback\` TEXT NOT NULL,
        \`done\` INTEGER NOT NULL
    );`;

    authDB.run(createUserTable);

};

const queryRunDB = (query: string): Promise<any> => {
    return new Promise((resolve, reject) => {

        authDB.run(query, function (error) {
            if(error) reject(error);
            else resolve(this);
        });

    });
};

const queryAllDB = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {

        authDB.all(query, (error, rows) => {
            if(error) reject(error);
            else resolve(rows);
        });

    });
};

export default {
    openDB,
    setupDB,
    queryRunDB,
    queryAllDB
};

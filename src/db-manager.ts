import fs from 'fs';
import path from 'path';
import sqlite from 'sqlite3';
import utility from './utility';

// create dir if not exists
const dbDir = '../data';
const dbDirPath = path.resolve(__dirname, dbDir);

if(!fs.existsSync(dbDirPath)) fs.mkdirSync(dbDirPath);

const dbFile = 'auth.db';
const dbFilePath = path.resolve(__dirname, dbDir, dbFile);

let authDB: sqlite.Database;

const open = () => {

    authDB = new sqlite.Database(dbFilePath, (error) => {

        if(error) utility.print(error.toString());
        else utility.print('DB Opened');

    });

};

const setup = () => {

    const createUserTable = `CREATE TABLE IF NOT EXISTS \`auth\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`email\` TEXT NOT NULL,
        \`code\` TEXT NOT NULL,
        \`callback\` TEXT NOT NULL,
        \`done\` INTEGER NOT NULL
    );`;

    authDB.run(createUserTable);

};

const query = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {

        authDB.all(query, (error, rows) => {
            if(error) reject(error);
            else resolve(rows);
        });

    });
};

export default {
    open,
    setup,
    query
};

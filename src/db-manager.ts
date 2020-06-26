import fs from 'fs';
import path from 'path';
import sqlite from 'sqlite3';
import * as utility from './utility';

let db: sqlite.Database;

export const open = () => {

    // create dir if not exists
    const dbDir = path.resolve(__dirname, '../data');

    if(!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

    const dbFile = path.resolve(__dirname, '../data', 'auth.db');

    db = new sqlite.Database(dbFile, (error) => {

        if(error) utility.print(error.toString());
        else utility.print('DB Opened');

        createTable();

    });

};

const createTable = () => {

    const createAuthTable = `CREATE TABLE IF NOT EXISTS \`auth\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`email\` TEXT NOT NULL,
        \`code\` TEXT NOT NULL,
        \`callback\` TEXT NOT NULL,
        \`done\` INTEGER NOT NULL
    );`;

    db.run(createAuthTable);

};

export const query = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {

        db.all(query, (error, rows) => {
            if(error) reject(error);
            else resolve(rows);
        });

    });
};

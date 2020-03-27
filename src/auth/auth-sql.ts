const addAuth = (email: string, code: string, callback: string): string =>
    `INSERT INTO auth VALUES (NULL, "${email}", "${code}", "${callback}", 0);`;

const selectAuth = (code: string): string =>
    `SELECT * FROM auth WHERE code = "${code}" AND done = 0;`;

const updateAuth = (id: number): string =>
    `UPDATE auth SET done = 1 WHERE id = ${id};`;

export default {
    addAuth,
    selectAuth,
    updateAuth
};

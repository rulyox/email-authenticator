const addAuth = (email: string, code: string, callback: string): string =>
    `INSERT INTO auth VALUES (NULL, "${email}", "${code}", "${callback}", 0);`;

const selectId = (id: number): string =>
    `SELECT * FROM auth WHERE id = ${id};`;

export default {
    addAuth,
    selectId
};

const add = (email: string, code: string, callback: string): string =>
    `INSERT INTO auth VALUES (NULL, "${email}", "${code}", "${callback}", 0);`;

const selectByCode = (code: string): string =>
    `SELECT * FROM auth WHERE code = "${code}";`;

const edit = (id: number): string =>
    `UPDATE auth SET done = 1 WHERE id = ${id};`;

export default {
    add,
    selectByCode,
    edit
};

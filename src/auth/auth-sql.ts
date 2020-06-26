export const add = (email: string, code: string, callback: string): string =>
    `
    INSERT INTO auth
    VALUES (NULL, "${email}", "${code}", "${callback}", 0)
    ;`;

export const selectByCode = (code: string): string =>
    `
    SELECT *
    FROM auth
    WHERE code = "${code}"
    ;`;

export const edit = (id: number): string =>
    `
    UPDATE auth
    SET done = 1
    WHERE id = ${id}
    ;`;

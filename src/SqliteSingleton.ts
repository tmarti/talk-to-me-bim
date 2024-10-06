import { Database } from "sql.js";

let _sqlite: Database | null = null;

export const setSqlite = (sqlite: Database) => {
    _sqlite = sqlite;
}

export const getSqlite = () => {
    return _sqlite!;
}
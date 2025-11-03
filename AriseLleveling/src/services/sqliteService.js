import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('AriseLleveling');

export const init = () => {
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_Datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            edad INTEGER
        );`
    )
}

const upsertDatos = (id, {nombre = null, edad = null}={}) => {
    const result = db.runSync(
        `INSERT OR REPLACE INTO user_Datos (id, nombre, edad) VALUES (?, ?, ?);`, [id, nombre, edad]
    )
    return result;
}

const getDatosById = (id) => {
    const row = db.getFirstSync(
        `SELECT * FROM user_Datos WHERE id = ?;`, [id]
    )
    return row || null;
}

const deleteDatosById = (id) => {
    const result = db.runSync(
        `DELETE FROM user_Datos WHERE id = ?;`, [id]
    )
    return result;
}

export default {init, upsertDatos, getDatosById, deleteDatosById}
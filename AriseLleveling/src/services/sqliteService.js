import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('AriseLleveling');

const init = ()=>{
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_Datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            edad INTEGER,
            anios INTEGER,
        );`
    )
}

const upsertDatos = (id, {nombre = null, edad = null, anios = null}={}) => {
    const result = db.runSync(
        `INSERT OR REPLACE INTO user_academic (id, nombre, edad, anios) VALUES (?, ?, ?, ?);`, [id, nombre, edad, anios]
    )
    return result;
}

const getDatosById = (id) => {
    const row = db.getFirstSync(
        `SELECT * FROM user_academic WHERE id = ?;`, [id]
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
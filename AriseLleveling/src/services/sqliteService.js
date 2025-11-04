/**
 * @file sqliteService.js
 * @description Servicio de base de datos local utilizando `expo-sqlite`.
 * Permite crear, insertar, consultar y eliminar registros de la tabla `user_Datos`.
 */

import * as SQLite from 'expo-sqlite';

/**
 * @constant {Database}
 * @description Instancia de la base de datos SQLite.
 * Se abre (o crea si no existe) una base de datos llamada `AriseLleveling`.
 */
const db = SQLite.openDatabaseSync('AriseLleveling');

/**
 * @function init
 * @description Inicializa la base de datos local y crea la tabla `user_Datos` si no existe.
 * 
 * La tabla contiene los siguientes campos:
 * - `id`: Identificador único (autoincremental).
 * - `nombre`: Nombre del usuario.
 * - `edad`: Edad del usuario.
 * 
 * @returns {void}
 */
export const init = () => {
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_Datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            edad INTEGER
        );`
    )
}

/**
 * @function upsertDatos
 * @description Inserta o actualiza un registro en la tabla `user_Datos`.
 * Si el `id` ya existe, reemplaza el registro existente (comportamiento "upsert").
 * 
 * @param {number} id - Identificador del usuario.
 * @param {Object} [datos={}] - Objeto con los datos del usuario.
 * @param {string|null} [datos.nombre=null] - Nombre del usuario.
 * @param {number|null} [datos.edad=null] - Edad del usuario.
 * 
 * @returns {SQLite.RunResult} Resultado de la operación SQLite.
 * 
 * @example
 * upsertDatos(1, { nombre: 'Juan', edad: 25 });
 */
const upsertDatos = (id, {nombre = null, edad = null}={}) => {
    const edadInt = edad === null ? null : parseInt(edad, 10);
    const result = db.runSync(
        `INSERT OR REPLACE INTO user_Datos (id, nombre, edad) VALUES (?, ?, ?);`, [id, nombre, edad]
    )
    return result;
}

/**
 * @function getDatosById
 * @description Obtiene un registro de la tabla `user_Datos` a partir de su `id`.
 * 
 * @param {number} id - Identificador del usuario a consultar.
 * @returns {Object|null} Objeto con los datos del usuario o `null` si no existe.
 * 
 * @example
 * const usuario = getDatosById(1);
 * console.log(usuario?.nombre);
 */ 
const getDatosById = (id) => {
    const row = db.getFirstSync(
        `SELECT * FROM user_Datos WHERE id = ?;`, [id]
    )
    return row || null;
}


/**
 * @function deleteDatosById
 * @description Elimina un registro de la tabla `user_Datos` por su identificador.
 * 
 * @param {number} id - Identificador del registro a eliminar.
 * @returns {SQLite.RunResult} Resultado de la operación de eliminación.
 * 
 * @example
 * deleteDatosById(1);
 */
const deleteDatosById = (id) => {
    const result = db.runSync(
        `DELETE FROM user_Datos WHERE id = ?;`, [id]
    )
    return result;
}

/**
 * @exports
 * @description Exporta las funciones principales del servicio SQLite.
 */
export default {init, upsertDatos, getDatosById, deleteDatosById}
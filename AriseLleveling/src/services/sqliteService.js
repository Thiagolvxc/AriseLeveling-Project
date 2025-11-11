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
 * @description Inicializa la base de datos local y crea las tablas necesarias.
 * @returns {void}
 */
export const init = () => {
    db.execSync(
        `CREATE TABLE IF NOT EXISTS user_Datos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            edad INTEGER
        );`
    );
    
    db.execSync(
        `CREATE TABLE IF NOT EXISTS ejercicios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            nombre TEXT NOT NULL,
            repeticiones INTEGER,
            series INTEGER,
            peso REAL,
            fecha TEXT NOT NULL,
            createdAt TEXT DEFAULT (datetime('now'))
        );`
    );
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
 * @function agregarEjercicio
 * @description Agrega un nuevo ejercicio a la base de datos.
 * @param {number} userId - ID del usuario.
 * @param {Object} ejercicio - Datos del ejercicio.
 * @param {string} ejercicio.nombre - Nombre del ejercicio.
 * @param {number} ejercicio.repeticiones - Número de repeticiones.
 * @param {number} ejercicio.series - Número de series.
 * @param {number|null} ejercicio.peso - Peso utilizado (opcional).
 * @param {string} ejercicio.fecha - Fecha del ejercicio (formato YYYY-MM-DD).
 * @returns {SQLite.RunResult} Resultado de la operación SQLite.
 */
const agregarEjercicio = (userId, {nombre, repeticiones, series, peso = null, fecha}) => {
    const result = db.runSync(
        `INSERT INTO ejercicios (userId, nombre, repeticiones, series, peso, fecha) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        [userId, nombre, repeticiones, series, peso, fecha]
    );
    return result;
}

/**
 * @function getEjerciciosPorFecha
 * @description Obtiene todos los ejercicios de un usuario para una fecha específica.
 * @param {number} userId - ID del usuario.
 * @param {string} fecha - Fecha en formato YYYY-MM-DD.
 * @returns {Array} Lista de ejercicios del día.
 */
const getEjerciciosPorFecha = (userId, fecha) => {
    const rows = db.getAllSync(
        `SELECT * FROM ejercicios 
         WHERE userId = ? AND fecha = ? 
         ORDER BY createdAt DESC;`,
        [userId, fecha]
    );
    return rows || [];
}

/**
 * @function eliminarEjercicio
 * @description Elimina un ejercicio por su ID.
 * @param {number} ejercicioId - ID del ejercicio a eliminar.
 * @returns {SQLite.RunResult} Resultado de la operación SQLite.
 */
const eliminarEjercicio = (ejercicioId) => {
    const result = db.runSync(
        `DELETE FROM ejercicios WHERE id = ?;`,
        [ejercicioId]
    );
    return result;
}

/**
 * @exports
 * @description Exporta las funciones principales del servicio SQLite.
 */
export default {
    init, 
    upsertDatos, 
    getDatosById, 
    deleteDatosById,
    agregarEjercicio,
    getEjerciciosPorFecha,
    eliminarEjercicio
}

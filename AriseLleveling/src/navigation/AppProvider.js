/**
 * @file AppProvider.jsx
 * @description Proveedor principal de la aplicación. 
 * Se encarga de inicializar la base de datos local SQLite antes de renderizar el resto de la aplicación.
 * Muestra un indicador de carga mientras se completa la inicialización.
 */

import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import sqliteService from '../services/sqliteService';

/**
 * @component AppProvider
 * @description Componente de alto nivel que inicializa recursos críticos de la aplicación (como SQLite) antes de renderizar los hijos.
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que se renderizan una vez completada la inicialización.
 * @returns {JSX.Element} Vista de carga mientras se inicializa, o los hijos una vez lista la app.
 */
const AppProvider = ({ children }) => {
    /**
     * @state
     * @type {[boolean, Function]}
     * @description Indica si la aplicación ya completó la inicialización de recursos (por ejemplo, la base de datos SQLite).
     */
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        /**
         * @async
         * @function init
         * @description Inicializa el servicio de SQLite y marca el estado como listo una vez completado.
         */
        const init = async () => {
            try {
                await sqliteService.init();
            } catch (e) {
                console.warn('SQLite init error', e);
            } finally {
                if (mounted) setReady(true);
            }
        };
        init();
        return () => { mounted = false; };
    }, []);

    /**
     * @returns {JSX.Element} Muestra un indicador de carga mientras la aplicación se prepara.
     */
    if (!ready) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    /**
     * @returns {JSX.Element} Los componentes hijos de la aplicación una vez la inicialización ha terminado.
     */
    return children;
};


export default AppProvider;
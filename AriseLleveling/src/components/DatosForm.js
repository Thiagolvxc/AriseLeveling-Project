import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import sqliteService from '../services/sqliteService';
import { Alert } from 'react-native';
import colors from '../constants/colors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

/**
 * @constant
 * @type {{ nombre: string, edad: number | null }}
 * @description Objeto base para inicializar el formulario vacío.
 */
const emptyForm = {
    nombre: '',
    edad: null,
};

/**
 * @component DatosForm
 * @description Componente que renderiza un formulario para mostrar, editar y eliminar datos almacenados localmente en SQLite.
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el formulario.
 */
const DatosForm =({onClose}) => {

    /**
     * @constant
     * @type {{ user: Object }}
     * @description Usuario autenticado obtenido desde el contexto de autenticación.
     */
    const {user} = useAuth();

    /**
     * @state
     * @type {[{nombre: string, edad: number | null}, Function]}
     * @description Estado que contiene los valores actuales del formulario.
     */
    const [form, setForm]= useState(emptyForm);

    /**
     * @state
     * @type {[boolean, Function]}
     * @description Indica si el componente está en proceso de carga (por ejemplo, al consultar o guardar datos).
     */
    const [loading, setloading]=useState(false);

    /**
     * @effect
     * @description Efecto que carga los datos del usuario desde SQLite al montar el componente o cuando cambia el usuario.
     */
    useEffect(()=>{
        let mounted = true;

        /**
         * @async
         * @function load
         * @description Carga los datos guardados en SQLite para el usuario actual.
         */
        const load = async ()=>{
            if(!user) return;

            try {
                setloading(true);
                const data = sqliteService.getDatosById(user.id);
                if (mounted) {
                    if (data) {
                        setForm({
                        nombre: data.nombre || '',
                        edad: data.edad || '',
                        });
                    }else{
                        setForm(emptyForm);
                    }
                }
            } catch (error) {
                console.warn('ERROR CARGANDO LOS DATOS ... DE SQLITE', error);
                Alert.alert('Error de carga', 'No fue posible cargar los datos de la base de datos local')    
            }finally{
                if (mounted) {
                    setloading(false);
                }
            }
        };
        load();
        return ()=>{
            mounted = false;
        };
    },[user]);

    /**
     * @function handleChange
     * @description Actualiza un campo específico del formulario.
     * @param {string} key - Clave del campo (por ejemplo, "nombre" o "edad").
     * @param {string|number} value - Nuevo valor del campo.
     */
    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    /**
     * @async
     * @function handleSave
     * @description Guarda los datos del formulario localmente en SQLite.  
     * Si el usuario no está autenticado, muestra un mensaje de error.
     */
    const handleSave = async () => {
        if (!user) return Alert.alert('Error', 'Usuario no autenticado');

        try {
            setloading(true);
            // Llamada síncrona
            sqliteService.upsertDatos(user.id, form);
            Alert.alert('Guardado', 'Datos académicos guardados localmente');
            onClose(); // Cerrar el formulario después de guardar
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'No se pudo guardar');
        } finally {
            setloading(false);
        }
    };

    /**
     * @function handleDelete
     * @description Elimina los datos del usuario actual desde SQLite después de una confirmación del usuario.
     */
    const handleDelete = () => {
        if (!user) return;

        Alert.alert(
            'Eliminar',
            '¿Deseas eliminar los datos académicos locales?',
            [{text: 'Cancelar', style: 'cancel'}, {text: 'Eliminar', style: 'destructive', onPress: () => {
                (async () => {
                    try {
                        setloading(true);
                        sqliteService.deleteDatosById(user.id);
                        setForm(emptyForm);
                        Alert.alert('Eliminado', 'Datos académicos eliminados');
                        onClose();
                    } catch (e) {
                        console.error(e);
                        Alert.alert('Error', 'No se pudo eliminar');
                    } finally {
                        setloading(false);
                    }
                })()
            }}]
        )
    };

    /**
     * @returns {JSX.Element} Renderiza un indicador de carga si el componente está procesando información.
     */
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.principal} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Datos</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} value={form.nombre} onChangeText={t => handleChange('nombre', t)} placeholder="Nombre Completo"/>

            <Text style={styles.label}>Edad</Text>
            <TextInput style={styles.input} value={form.edad} onChangeText={t => handleChange('edad', t)} placeholder="Edad" keyboardType='numeric'/>

            <View style={styles.row}>

                <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.delete]} onPress={handleDelete} disabled={loading}>
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingVertical: 10,
        paddingHorizontal: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    loaderContainer: {
        padding: 12,
        alignItems: 'center',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.principal,
    },

    closeButton: {
        padding: 5,
        borderRadius: 15,
        backgroundColor: '#eee',
    },

    closeButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.subtle,
    },

    label: {
        fontSize: 13,
        color: colors.subtle,
        marginTop: 8,
    },
    
    input: {
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#eee',
    },

    multiline: {
        minHeight: 60,
        textAlignVertical: 'top',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
    },

    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    save: {
        backgroundColor: colors.principal,
    },

    delete: {
        backgroundColor: '#d9534f',
    },
    
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});


export default DatosForm;
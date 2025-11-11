/**
 * @file HomeScreen.jsx
 * @description Pantalla principal (Home) de la aplicación. 
 * Permite ingresar ejercicios realizados hoy y mostrarlos en una lista.
 */

import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import sqliteService from '../services/sqliteService';
import colors from '../constants/colors';

/**
 * @component HomeScreen
 * @description Componente de la pantalla principal de la aplicación.
 * Permite ingresar y visualizar ejercicios del día actual.
 * @returns {JSX.Element} Vista de la pantalla de inicio.
 */
const HomeScreen = () => {
  const { user } = useAuth();
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
    
  /**
   * @state
   * @type {[{nombre: string, repeticiones: string, series: string, peso: string}, Function]}
   * @description Estado que contiene los valores actuales del formulario.
   */
  const [form, setForm] = useState({
    nombre: '',
    repeticiones: '',
    series: '',
    peso: ''
  });

  /**
   * @function obtenerFechaHoy
   * @description Obtiene la fecha actual en formato YYYY-MM-DD.
   * @returns {string} Fecha actual.
   */
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  /**
   * @effect
   * @description Carga los ejercicios del día actual al montar el componente o cuando cambia el usuario.
   */
  useEffect(() => {
    if (user) {
      cargarEjercicios();
    }
  }, [user]);

  /**
   * @async
   * @function cargarEjercicios
   * @description Carga los ejercicios del día actual desde SQLite.
   */
  const cargarEjercicios = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const fechaHoy = obtenerFechaHoy();
      const ejerciciosHoy = sqliteService.getEjerciciosPorFecha(user.id, fechaHoy);
      setEjercicios(ejerciciosHoy);
    } catch (error) {
      console.error('Error cargando ejercicios:', error);
      Alert.alert('Error', 'No se pudieron cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleChange
   * @description Actualiza un campo específico del formulario.
   * @param {string} key - Clave del campo.
   * @param {string} value - Nuevo valor del campo.
   */
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /**
   * @async
   * @function handleGuardarEjercicio
   * @description Guarda un nuevo ejercicio en la base de datos.
   */
  const handleGuardarEjercicio = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    if (!form.nombre.trim()) {
      Alert.alert('Error', 'El nombre del ejercicio es requerido');
      return;
    }

    if (!form.repeticiones || parseInt(form.repeticiones) <= 0) {
      Alert.alert('Error', 'Las repeticiones deben ser mayores a 0');
      return;
    }

    if (!form.series || parseInt(form.series) <= 0) {
      Alert.alert('Error', 'Las series deben ser mayores a 0');
      return;
    }

    try {
      setLoading(true);
      const fechaHoy = obtenerFechaHoy();
      sqliteService.agregarEjercicio(user.id, {
        nombre: form.nombre.trim(),
        repeticiones: parseInt(form.repeticiones),
        series: parseInt(form.series),
        peso: form.peso ? parseFloat(form.peso) : null,
        fecha: fechaHoy
      });
      setForm({ nombre: '', repeticiones: '', series: '', peso: '' });
      setMostrarFormulario(false);
      await cargarEjercicios();
      Alert.alert('Éxito', 'Ejercicio guardado correctamente');
    } catch (error) {
      console.error('Error guardando ejercicio:', error);
      Alert.alert('Error', 'No se pudo guardar el ejercicio');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleEliminarEjercicio
   * @async
   * @description Elimina un ejercicio después de confirmación.
   * @param {number} ejercicioId - ID del ejercicio a eliminar.
   */
  const handleEliminarEjercicio = (ejercicioId) => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }
    Alert.alert(
        'Eliminar ejercicio',
        '¿Estás seguro de que deseas eliminar este ejercicio?',
        [{text: 'Cancelar', style: 'cancel'}, {text: 'Eliminar', style: 'destructive', onPress: () => {
            (async () => {
                try {
                    setLoading(true);
                    sqliteService.eliminarEjercicio(ejercicioId);
                    await cargarEjercicios();
                    Alert.alert('Éxito', 'Ejercicio eliminado');
                } catch (error) {
                    console.error('Error eliminando ejercicio:', error);
                    Alert.alert('Error', 'No se pudo eliminar el ejercicio');
                } finally {
                    setLoading(false);
                }
            })()
        }}]
    );
  };

  /**
   * @returns {JSX.Element} Renderiza la pantalla principal de la aplicación.
   */
  return (
    <LinearGradient colors={colors.gradienteSecundario} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Mis Ejercicios de Hoy</Text>
        <Text style={styles.fecha}>{new Date().toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>

        {/* Botón para mostrar/ocultar formulario */}
        <TouchableOpacity style={styles.botonAgregar} onPress={() => setMostrarFormulario(!mostrarFormulario)}>
          <Text style={styles.botonAgregarTexto}>
              {mostrarFormulario ? 'Cancelar' : '+ Agregar Ejercicio'}
          </Text>
        </TouchableOpacity>

        {/* Formulario de ejercicio */}
        {mostrarFormulario && (
          <View style={styles.formulario}>
            <Text style={styles.label}>Nombre del Ejercicio</Text>
            <TextInput 
              style={styles.input} 
              value={form.nombre} 
              onChangeText={(text) => handleChange('nombre', text)} 
              placeholder="Ej: Press de banca" placeholderTextColor={colors.delicate}
            />

            <Text style={styles.label}>Repeticiones</Text>
            <TextInput
              style={styles.input}
              value={form.repeticiones}
              onChangeText={(text) => handleChange('repeticiones', text)}
              placeholder="Ej: 10"
              keyboardType="numeric"
              placeholderTextColor={colors.delicate}
            />

            <Text style={styles.label}>Series</Text>
            <TextInput
              style={styles.input}
              value={form.series}
              onChangeText={(text) => handleChange('series', text)}
              placeholder="Ej: 3"
              keyboardType="numeric"
              placeholderTextColor={colors.delicate}
            />

            <Text style={styles.label}>Peso (kg) - Opcional</Text>
            <TextInput
              style={styles.input}
              value={form.peso}
              onChangeText={(text) => handleChange('peso', text)}
              placeholder="Ej: 50"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.delicate}
            />

            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={handleGuardarEjercicio}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonGuardarTexto}>Guardar Ejercicio</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de ejercicios */}
        <View style={styles.listaContainer}>
          <Text style={styles.listaTitulo}>Ejercicios Realizados</Text>
                    
          {loading && ejercicios.length === 0 ? (
              <ActivityIndicator size="small" color={colors.principal} style={styles.loader} />
          ) : ejercicios.length === 0 ? (
            <Text style={styles.sinEjercicios}>
              No has registrado ejercicios hoy. ¡Agrega tu primer ejercicio!
            </Text>
          ) : (
            ejercicios.map((ejercicio) => (
              <View key={ejercicio.id} style={styles.ejercicioCard}>
                <View style={styles.ejercicioHeader}>
                  <Text style={styles.ejercicioNombre}>{ejercicio.nombre}</Text>
                  <TouchableOpacity
                    onPress={() => handleEliminarEjercicio(ejercicio.id)}
                    style={styles.botonEliminar}
                  >
                    <Text style={styles.botonEliminarTexto}>✕</Text>
                  </TouchableOpacity>
                </View>
                                
                <View style={styles.ejercicioDetalles}>
                  <Text style={styles.ejercicioTexto}>
                    Series: <Text style={styles.ejercicioValor}>{ejercicio.series}</Text>
                  </Text>
                  <Text style={styles.ejercicioTexto}>
                    Repeticiones: <Text style={styles.ejercicioValor}>{ejercicio.repeticiones}</Text>
                  </Text>
                  {ejercicio.peso && (
                    <Text style={styles.ejercicioTexto}>
                      Peso: <Text style={styles.ejercicioValor}>{ejercicio.peso} kg</Text>
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
      padding: 20,
      paddingBottom: 40,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.luminous,
    marginBottom: 8,
    textAlign: 'center',
  },

  fecha: {
    fontSize: 16,
    color: colors.variante4,
    marginBottom: 24,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
    
  botonAgregar: {
    backgroundColor: colors.principal,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  botonAgregarTexto: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: '700',
  },
    
  formulario: {
    backgroundColor: colors.luminous,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
    
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.default,
    marginTop: 12,
    marginBottom: 6,
  },
    
  input: {
    backgroundColor: colors.fondoClaro,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.delicate,
    fontSize: 16,
    color: colors.default,
  },
    
  botonGuardar: {
    backgroundColor: colors.exito,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
    
  botonGuardarTexto: {
    color: colors.luminous,
    fontSize: 16,
  },
    
  listaContainer: {
    marginTop: 8,
  },
    
  listaTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.luminous,
    marginBottom: 16,
  },
    
  loader: {
    marginVertical: 20,
  },
    
  sinEjercicios: {
    fontSize: 16,
    color: colors.variante4,
    textAlign: 'center',
    paddingVertical: 40,
    fontStyle: 'italic',
  },
    
  ejercicioCard: {
    backgroundColor: colors.luminous,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
    
  ejercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
    
  ejercicioNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.principal,
    flex: 1,
  },
    
  botonEliminar: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.error,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
   
  botonEliminarTexto: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: 'bold',
  },
    
  ejercicioDetalles: {
    gap: 8,
  },
    
  ejercicioTexto: {
    fontSize: 14,
    color: colors.subtle,
  },
    
  ejercicioValor: {
    fontWeight: '700',
    color: colors.default,
  },
});

export default HomeScreen;
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  // ESTADOS DE LA APLICACIÓN
  const [error, setError] = useState('');        // Estado para manejar mensajes de error
  const [loading, setLoading] = useState(false); // Estado para mostrar carga durante la petición
  const [city, setCity] = useState('');          // Estado para almacenar la ciudad ingresada por el usuario
  const [weather, setWeather] = useState<WeatherData | null>(null); // Estado para almacenar los datos del clima

  // TIPADO DE TYPESCRIPT PARA LOS DATOS DEL CLIMA
  // Define la estructura de los datos que esperamos recibir de la API
  type WeatherData = {
    name: string; // Nombre de la ciudad
    main: {
      temp: number;      // Temperatura actual
      humidity: number;  // Humedad porcentual
    };
    weather: { description: string }[]; // Descripción del clima (nublado, soleado, etc.)
    wind: { speed: number }; // Velocidad del viento
  };

  // PROTECCIÓN DE LA LLAVE DE LA API USANDO VARIABLES DE ENTORNO
  // EXPO_PUBLIC_API_KEY se carga desde .env o las variables de entorno de la plataforma
  // Ventajas de usar variables de entorno:
  // - No se expone la API key en el código fuente
  // - Diferentes keys para desarrollo y producción
  // - Fácil rotación de keys sin modificar código
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  // FUNCIÓN PRINCIPAL PARA OBTENER EL CLIMA
  const getWeather = async () => {
    // Validación: Verifica que el usuario haya ingresado una ciudad
    if (!city) return setError('Ingresa una ciudad primero');
    
    // Inicia el estado de carga y limpia errores previos
    setLoading(true);
    setError('');
    
    try {
      // Construye la URL de la API con parámetros:
      // - city: ciudad buscada
      // - appid: API key (protegida por variable de entorno)
      // - units=metric: para obtener temperatura en Celsius
      // - lang=es: para obtener descripciones en español
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
      
      // Realiza la petición HTTP usando axios
      const { data } = await axios.get(url);
      
      // Almacena los datos del clima en el estado
      setWeather(data);
    } catch (err) {
      // Manejo de errores: ciudad no encontrada o problemas de conexión
      setError('No se encontró la ciudad');
      setWeather(null);
    } finally {
      // Finaliza el estado de carga independientemente del resultado
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima App</Text>

      {/* CONTENEDOR DE BÚSQUEDA CON DISPOSICIÓN HORIZONTAL */}
      <View style={styles.searchContainer}>
        {/* INPUT PARA INGRESAR LA CIUDAD */}
        <TextInput
          style={styles.input}
          placeholder="Busca una ciudad..."
          value={city}
          onChangeText={setCity} // Actualiza el estado 'city' con cada tecleo
          onSubmitEditing={getWeather} // Permite buscar presionando "Enter"
        />
        
        {/* BOTÓN DE BÚSQUEDA */}
        <TouchableOpacity style={styles.button} onPress={getWeather}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* INDICADOR DE CARGA DURANTE LA PETICIÓN */}
      {loading && <ActivityIndicator size="large" color="#00bcd4" style={{ marginTop: 20 }} />}

      {/* MENSAJE DE ERROR SI LA CIUDAD NO SE ENCUENTRA */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* RESULTADOS DEL CLIMA - SE MUESTRA SOLO CUANDO HAY DATOS */}
      {weather && (
        <View style={styles.result}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
          <Text style={styles.details}>Humedad: {weather.main.humidity}%</Text>
          <Text style={styles.details}>Viento: {weather.wind.speed} m/s</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // CONTENEDOR FLEX QUE ORGANIZA INPUT Y BOTÓN EN LÍNEA
  searchContainer: {
    flexDirection: 'row',     // Disposición horizontal
    alignItems: 'center',     // Centra verticalmente los elementos
    marginBottom: 10,
  },
  input: {
    flex: 1,                  // Ocupa todo el espacio disponible
    backgroundColor: '#e8e8e8ff',
    borderColor: '#000000ff',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginRight: 10,          // Espacio entre input y botón
  },
  button: {
    backgroundColor: '#3872c4ff',
    padding: 12,
    borderRadius: 10,
    minWidth: 80,             // Ancho mínimo para mantener consistencia
    alignItems: 'center',     // Centra el texto horizontalmente
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  result: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#d3d3d3ff',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  city: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 20,
    textTransform: 'capitalize', // Primera letra en mayúscula
  },
  details: {
    fontSize: 16,
  },
});
import axios from 'axios';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState('');

  const [weather, setWeather] = useState<WeatherData | null>(null);
  type WeatherData = {
    name: string;
    main: {
      temp: number;
      humidity: number;
    };
    weather: { description: string }[];
    wind: { speed: number };
  };

  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  const getWeather = async () => {
    if (!city) return setError('Ingresa una ciudad primero');
    setLoading(true);
    setError('');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
      const { data } = await axios.get(url);
      setWeather(data);
    } catch (err) {
      setError('No se encontró la ciudad');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima App</Text>

      <TextInput
        style={styles.input}
        placeholder="Busca una ciudad..."
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={getWeather}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#00bcd4" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
  input: {
    width: '90%',
    backgroundColor: '#e8e8e8ff',
    borderColor: '#000000ff',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#3872c4ff',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
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
    width: '90%',
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
    textTransform: 'capitalize',
  },
  details: {
    fontSize: 16,
  },
});

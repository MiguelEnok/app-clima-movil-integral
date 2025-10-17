# 🌦️ Clima App

Aplicación móvil desarrollada con **React Native** que permite consultar información del clima en tiempo real mediante la API de **OpenWeatherMap**.  
El proyecto utiliza **Axios** para las peticiones HTTP y **variables de entorno** para proteger la API key.

---

## 📋 Descripción General

La aplicación permite al usuario ingresar el nombre de una ciudad y obtener datos meteorológicos actualizados como:
- Temperatura actual (en °C)
- Humedad relativa
- Velocidad del viento
- Descripción general del clima (nublado, soleado, etc.)

Todo el proceso de comunicación con la API se realiza de manera segura, y la interfaz está optimizada para mostrar la información de forma clara y ordenada.

---

## ⚙️ Funciones Principales

### 🔹 `getWeather()`
Esta es la **función principal** que realiza la consulta del clima:

**Propósito:**
Obtener la información del clima en tiempo real desde OpenWeatherMap según la ciudad ingresada por el usuario.

**Proceso interno:**
1. **Validación:** verifica que el usuario haya ingresado una ciudad.  
2. **Limpieza de estados:** reinicia los mensajes de error y activa el indicador de carga (`loading`).  
3. **Construcción de la URL:** genera la URL de la API incluyendo:
   - `q`: nombre de la ciudad ingresada.  
   - `appid`: clave API (almacenada en variable de entorno).  
   - `units=metric`: para mostrar temperatura en grados Celsius.  
   - `lang=es`: para mostrar descripciones en español.  
4. **Petición HTTP:** utiliza `axios.get()` para realizar la solicitud.  
5. **Gestión de respuesta:**
   - Si la petición es exitosa, los datos se almacenan en el estado `weather`.  
   - Si ocurre un error (por ejemplo, ciudad no encontrada), se actualiza el estado `error`.  
6. **Finalización:** se desactiva el estado `loading` una vez terminada la petición.

---

### 🔹 Estados principales de la aplicación

| Estado | Descripción |
|---------|--------------|
| `city` | Almacena el nombre de la ciudad ingresada por el usuario. |
| `weather` | Contiene los datos meteorológicos obtenidos de la API. |
| `error` | Guarda mensajes de error (por ejemplo, ciudad no encontrada). |
| `loading` | Controla el indicador de carga mientras se realiza la petición. |

---

### 🔹 Renderización de los datos

Cuando la función `getWeather()` obtiene una respuesta válida, se muestran los resultados en un contenedor central con la siguiente información:

- Nombre de la ciudad (`weather.name`)  
- Temperatura (`weather.main.temp`)  
- Descripción del clima (`weather.weather[0].description`)  
- Humedad (`weather.main.humidity`)  
- Velocidad del viento (`weather.wind.speed`)

El diseño utiliza `StyleSheet` con una paleta clara y componentes de React Native como `TextInput`, `TouchableOpacity` y `ActivityIndicator`.

---

## 🔐 Medidas de Seguridad Implementadas

1. **Uso de variables de entorno:**  
   - La API Key no está escrita directamente en el código.  
   - Se accede mediante `process.env.EXPO_PUBLIC_API_KEY`, la cual se configura en el archivo `.env`.  
   - Esto evita la exposición de credenciales en el repositorio.  

2. **Configuración del archivo `.env`:**  
   Crea un archivo `.env` en la raíz del proyecto con la siguiente línea:
   ```env
   EXPO_PUBLIC_API_KEY=tu_api_key_de_openweathermap

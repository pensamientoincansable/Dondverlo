# Simulación de backend para compartir recomendaciones

Este archivo describe cómo debería funcionar un backend para compartir las recomendaciones entre usuarios.

## Funcionalidad requerida

Para que las recomendaciones se compartan entre todos los usuarios, se necesitaría un backend con las siguientes funcionalidades:

### 1. Endpoint para obtener recomendaciones
```javascript
GET /api/recommendations
```
Devuelve todas las recomendaciones almacenadas en el servidor.

### 2. Endpoint para guardar recomendaciones
```javascript
POST /api/recommendations
Content-Type: application/json

{
  "userName": "nombre_usuario",
  "content": "descripción de la recomendación",
  "link": "https://ejemplo.com/pelicula",
  "type": "movie|series",
  "date": "fecha"
}
```
Guarda una nueva recomendación en el servidor.

### 3. Actualización del frontend

Para conectar con el backend, se deben modificar las funciones `saveToLocalStorage` y `loadComments` en el archivo `index.html`:

```javascript
// Función para guardar en el backend
async function saveToBackend(comment) {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    });
    
    if (response.ok) {
      console.log('Recomendación guardada en el servidor');
      return true;
    } else {
      console.error('Error al guardar en el servidor');
      return false;
    }
  } catch (error) {
    console.error('Error de red:', error);
    return false;
  }
}

// Función para cargar desde el backend
async function loadFromBackend() {
  try {
    const response = await fetch('/api/recommendations');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error al cargar del servidor');
      return { movies: [], series: [] };
    }
  } catch (error) {
    console.error('Error de red:', error);
    return { movies: [], series: [] };
  }
}
```

### 4. Archivo de ejemplo para backend (Node.js/Express)

```javascript
// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './data/recommendations.json';

app.use(cors());
app.use(express.json());

// Asegurarse de que el directorio y archivo existan
async function initializeDataFile() {
  try {
    await fs.access(path.dirname(DATA_FILE));
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ movies: [], series: [] }));
  }
}

// Obtener todas las recomendaciones
app.get('/api/recommendations', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error leyendo archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Guardar una nueva recomendación
app.post('/api/recommendations', async (req, res) => {
  try {
    const newData = req.body;
    const currentData = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
    
    if (newData.type === 'movie') {
      currentData.movies.push(newData);
    } else {
      currentData.series.push(newData);
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error escribiendo archivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

initializeDataFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
```

### 5. Consideraciones de seguridad

- Validar entradas del usuario
- Implementar rate limiting
- Considerar autenticación opcional para prevenir abusos
- Sanitizar entradas para prevenir XSS

## Uso en entornos reales

Para desplegar esta aplicación en un entorno real donde las recomendaciones se compartan entre usuarios:

1. Implementar el backend con uno de los frameworks disponibles (Node.js, Python Flask/Django, PHP, etc.)
2. Alojar el backend en un servidor accesible
3. Actualizar las URLs en el frontend para apuntar al backend real
4. Asegurar la comunicación con HTTPS
5. Implementar medidas de seguridad adecuadas

## Alternativas

Si no se puede implementar un backend completo, se pueden considerar alternativas como:

- GitHub Pages + GitHub Actions para actualizar el archivo JSON
- Servicios de backend como Firebase, Supabase, etc.
- APIs de terceros como Airtable o Google Sheets
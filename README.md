# dondeverlo - Foro de Recomendaciones de Cine

## Descripción
Foro web donde los usuarios pueden compartir recomendaciones de películas y series. Las recomendaciones se guardan en un repositorio de GitHub, permitiendo que todos los usuarios vean y compartan las mismas recomendaciones desde cualquier dispositivo.

## Características
- 🎬 Interfaz cinematográfica con efectos visuales
- 📝 Formulario para recomendar películas y series
- ☁️ Almacenamiento en repositorio GitHub
- 🔄 Sincronización automática y manual
- 📱 Diseño responsive
- 💾 Funcionamiento offline con localStorage

## Instalación y Configuración

### Paso 1: Crear un repositorio en GitHub
1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Dale un nombre (ej: "dondeverlo")
3. Elige si será público o privado

### Paso 2: Crear un Token de Acceso Personal
1. En GitHub, ve a **Settings > Developer settings > Personal access tokens**
2. Haz clic en **Tokens (classic) > Generate new token (classic)**
3. Configura el token:
   - **Note**: "dondeverlo-web"
   - **Expiration**: Elige una duración (recomendado: 90 días)
   - **Select scopes**: Marca **repo** (acceso completo a repositorios)
4. Haz clic en **Generate token**
5. **¡COPIA EL TOKEN!** Solo lo verás esta vez

### Paso 3: Configurar la Aplicación
1. Sube todos los archivos a tu repositorio
2. Abre la aplicación web (puedes usar GitHub Pages o cualquier hosting)
3. En la sección "Configuración de GitHub", ingresa:
   - **Token de GitHub**: El token que copiaste
   - **Usuario de GitHub**: Tu nombre de usuario
   - **Repositorio**: El nombre de tu repositorio
4. Haz clic en **Guardar configuración**

### Paso 4: Usar la Aplicación
1. Los usuarios pueden ahora recomendar películas y series
2. Las recomendaciones se guardarán en `data/recommendations.json`
3. Todos los usuarios verán las mismas recomendaciones

## Estructura de Archivos
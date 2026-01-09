# dondeverlo - Tu foro de recomendaciones de cine

## Descripción

Aplicación web para compartir recomendaciones de películas y series. Los usuarios pueden publicar sus recomendaciones favoritas y ver las de otros usuarios.

## Características

- Interfaz visual atractiva con efectos cinematográficos
- Formulario intuitivo para publicar recomendaciones
- Separación entre películas y series
- Diseño responsive adaptable a dispositivos móviles
- Almacenamiento local de recomendaciones

## Cómo usar

1. Abre la aplicación web en tu navegador
2. Ingresa tu nombre
3. Escribe tu recomendación
4. Proporciona un enlace a la película o serie
5. Selecciona si es una película o serie
6. Haz clic en "Publicar recomendación"

## Almacenamiento

Las recomendaciones se guardan localmente en tu navegador usando localStorage. En un entorno de producción, se necesitaría un backend para compartir las recomendaciones entre usuarios.

## Estructura del proyecto

```
/workspace/
├── index.html          # Página principal con toda la lógica
├── data/
│   └── recomendations.json  # Archivo JSON para almacenamiento compartido
├── README.md           # Documentación del proyecto
└── local-storage-manager.js  # Gestor del almacenamiento local
```

## Notas sobre el desarrollo

La versión actual almacena las recomendaciones en localStorage del navegador. Para que las recomendaciones se compartan entre usuarios en un entorno real, se necesitaría:

1. Un backend que gestione el archivo JSON
2. Un mecanismo para que los clientes obtengan actualizaciones periódicas
3. Un sistema de sincronización

Este proyecto está preparado para integrarse fácilmente con un backend simplemente cambiando las funciones de `saveToLocalStorage` y `loadComments` por llamadas a API.

## Licencia

MIT
# Proyecto de Chat con Next.js y Firebase

Este proyecto es una aplicación de chat con un LLM construida con Next.js, Firebase, MSSQL y VertexAI. Utiliza React Query para la gestión del estado del servidor, Material UI para los componentos de la interfaz de usuario y un endpoint en Google Cloud con el modelo Palm2 para responder en el chat.

## Usar

Para usar la aplicación, debe ingresar al siguiente enlace: [aiChatApp](https://ai-chat-app-2.vercel.app/). Una vez allí, puede registrarse y comenzar a chatear con el modelo de lenguaje.

## Backend

El backend de la aplicación se encuentra en el siguiente repositorio: [aiChat Backend](https://github.com/TobiasJoseHermann/aiChatAppGoApi)

## Estructura del Proyecto

El proyecto se estructura de la siguiente manera:

-   pages: Contiene los componentes de las páginas de la aplicación.
-   utils: Contiene funciones de utilidad, incluyendo la configuración de la base de datos y Firebase.
-   components: Contiene componentes reutilizables como el componente de carga.

## Docker

El proyecto incluye un Dockerfile para construir una imagen de Docker de la aplicación.

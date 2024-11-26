# Instrucciones para Configurar y Ejecutar la Aplicación

## 1. Instalar los Módulos de Node

Antes de ejecutar la aplicación, es necesario instalar las dependencias del proyecto. Esto se hace ejecutando el siguiente comando en la raíz del proyecto:

```bash
npm install
```

## 2. Configurar Variables de Entorno

1. Localiza el archivo llamado .env.template en la raíz del proyecto.
2. Renómbralo a .env

3. Abre el archivo .env en tu editor de texto y completa las siguientes variables con los valores proporcionados por Supabase:

- EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_URL: URL de tu proyecto Supabase.
- EXPO_PUBLIC_YOUR_REACT_NATIVE_SUPABASE_ANON_KEY: Llave anónima de tu proyecto Supabase.

### 3. Ejecutar la Aplicación
Para iniciar la aplicación en un entorno de desarrollo, utiliza el siguiente comando en la terminal:
```bash
npm start
```

Este comando abrirá el Expo Developer Tools, donde podrás elegir ejecutar la aplicación en un emulador, dispositivo físico, o navegador.
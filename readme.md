# Archivo de Proyecto: Arquetipo D/D/D (Yu-Gi-Oh!)

Aplicacion web interactiva para la asignatura de Desarrollo Web y Bases de Datos (PUCV), que permite consultar, filtrar y visualizar cartas del arquetipo D/D/D conectandose a una base de datos MySQL mediante un backend en Node.js y Express.

## Tecnologias Utilizadas

* Frontend: HTML5, Bootstrap 5, JavaScript.
* Backend: Node.js, Express.
* Base de Datos: MySQL (`mysql2`).

## Estructura del Proyecto

```
Diseño web Ev3/
│
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── datos.sql
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/script.js
│   └── index.html
│
└── README.md
```

## Guia de Instalacion y Ejecucion Local

### 1. Clonar el Repositorio
Abre tu terminal o editor de codigo en la carpeta raiz del proyecto.

### 2. Configurar la Base de Datos
Importa el script SQL ubicado en `backend/datos.sql` en MySQL Workbench para crear la base de datos `yugioh_ddd` con sus respectivas tablas.

### 3. Configurar el Backend
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la carpeta `backend` con las siguientes credenciales:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=yugioh_ddd
   DB_USER=root
   DB_PASSWORD=tu_contraseña_mysql
   ```

### 4. Iniciar el Servidor Backend
Ejecuta el servidor en modo desarrollo:
```bash
npm run dev
```

### 5. Abrir el Frontend
Abre el archivo `frontend/index.html` usando un servidor local (como Live Server en VS Code).
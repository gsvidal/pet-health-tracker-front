# 🐾 Pet Health Tracker - Frontend

Frontend de la plataforma **Pet Health Tracker**, una aplicación diseñada para que los dueños de mascotas registren, controlen y gestionen la salud y nutrición de sus animales.

---

## 🚀 Instalación y Configuración

Sigue estos pasos para clonar, instalar dependencias y ejecutar el proyecto localmente.

### 1️⃣ Clonar el repositorio

Puedes usar **SSH** o **HTTPS** según tu configuración:

#### Usando SSH

```bash
git clone git@github.com:Juliandos/Pet-HealthCare-Front.git
```

#### Usando HTTPS

```bash
git clone https://github.com/Juliandos/Pet-HealthCare-Front.git
```

Accede al directorio del proyecto:

```bash
cd Pet-HealthCare-Front
```

---

### 2️⃣ Instalar dependencias

Instala las dependencias necesarias con tu gestor preferido:

#### Con npm

```bash
npm install
```

#### O con yarn

```bash
yarn install
```

---

### 3️⃣ Ejecutar en modo desarrollo

Inicia el entorno de desarrollo con:

#### Con npm

```bash
npm run dev
```

#### O con yarn

```bash
yarn dev
```

La aplicación se ejecutará por defecto en:  
👉 **http://localhost:5173**

---

## 🧩 Tecnologías principales

- **React + TypeScript + Vite** → base del proyecto para un desarrollo rápido y tipado seguro.  
- **Sass** → preprocesador CSS con soporte de variables, nesting y modularidad.  
- **ESLint + Prettier** → herramientas para linting y formateo consistente.  
- **Axios** → gestión de peticiones HTTP.  
- **React Router v6** → enrutamiento moderno y declarativo.

---

## 💡 Recomendaciones

- Usa **VS Code** con las extensiones **Prettier** y **ESLint** activadas.  
- Configura la opción *Format on Save* para mantener el estilo uniforme.  
- Antes de subir cambios, ejecuta el linting local para detectar errores.

---

## 🧭 Estructura básica del proyecto

```
Pet-HealthCare-Front/
│
├── src/
│   ├── features/           # Módulos principales (auth, pets, dashboard, etc.)
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Lógica de comunicación con API
│   ├── utils/              # Funciones utilitarias
│   ├── styles/             # Estilos globales y variables Sass
│   └── main.tsx            # Punto de entrada principal
│
├── .eslintrc.js            # Configuración de ESLint
├── .prettierrc             # Configuración de Prettier
├── vite.config.ts          # Configuración del bundler
└── package.json
```

---

## 🧑‍💻 Scripts disponibles

- `npm run dev` → ejecuta el servidor de desarrollo.  
- `npm run build` → compila la aplicación para producción.  
- `npm run lint` → analiza el código con ESLint.  
- `npm run preview` → vista previa local del build de producción.

---

## 🐶 Créditos

Proyecto desarrollado por el equipo de **No Country** como parte del MVP de *Pet Health Tracker*.

---
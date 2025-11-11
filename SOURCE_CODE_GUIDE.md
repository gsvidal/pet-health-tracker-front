# Pet Health Tracker - Guía del Código Fuente (Frontend)

Bienvenido al equipo frontend de **Pet Health Tracker**. Este documento sirve como guía para nuevos miembros del equipo, explicando la arquitectura, estructura de carpetas, tecnologías, convenciones y flujo de desarrollo del MVP.

---

## 1️⃣ Arquitectura

- La aplicación está construida con **React + TypeScript + Vite**.
- Se utiliza una **arquitectura feature-based inspirada en Clean Architecture**:
  - **Models / Types** → representan los datos centrales (Pet, Vaccine, Meal, Reminder, User) (TODO: Usar models del backend)
  - **Adapters** → transforman datos del backend a frontend.
  - **Services** → llamadas a API.
  - **Hooks** → encapsulan lógica de negocio y estado.
  - **Components** → UI específica por feature.
  - **Pages** → entry points por ruta.

- **Flujo típico de datos:**

```
Page → Component → Hook → Adapter → Service → Model
```

- Cada **feature** (auth, pets, healthRecords, nutrition, reminders, dashboard) funciona como un mini-módulo independiente, fácil de mantener y escalar.

---

## 2️⃣ Tecnologías y Motivación

- **React + TypeScript + Vite** → rapidez, tipado seguro, fácil escalabilidad.
- **Sass** → Igual que CSS pero con nesting, variables, etc... mobile-first, consistente.
- **React Router v6** → enrutamiento declarativo.
- **Axios** → llamadas HTTP centralizadas, uso de interceptores y abort controllers.

**Motivación:** Buscar el equilibrio entre velocidad de desarrollo del MVP y conseguir un código **limpio, legible, escalable y modular**, fácil de entender para nuevos miembros.

---

## 3️⃣ Archivos importantes

- `features/` → módulos por dominio:
  - auth, pets, healthRecords, nutrition, reminders, dashboard (TODO)
  - Cada feature contiene: `models/`, `adapters/`, `services/`, `hooks/`, `components/`, `pages/`
- `components/` → componentes genéricos reutilizables (`Button`, `Input`, `Modal`, etc.)
- `hooks/` → hooks globales reutilizables (`useFetch`, `useDebounce`)
- `services/` → configuración global de API (axios, interceptores)
- `utils/` → funciones utilitarias y helpers
- `models/` → tipos compartidos y interfaces globales
- `.env` → variables de entorno globales
- `pages/` → páginas globales (ej. HomePage)

---

## 4️⃣ Routing

- Usamos **React Router v6**.
- Las rutas principales se mapean a las páginas dentro de cada feature.
- Ejemplos:
  - `/login` → `features/auth/pages/LoginPage.tsx`
  - `/pets` → `features/pets/pages/PetsPage.tsx`
  - `/pets/:id` → `features/pets/pages/PetProfilePage.tsx`
  - `/dashboard` → `features/dashboard/pages/DashboardPage.tsx`
  - `/` → `pages/HomePage.tsx`

- Se utilizan **layouts y rutas privadas** para proteger secciones como dashboard o perfil de mascota.

---

## 5️⃣ Estado

- **Global state:** Zustand para información de usuario y autenticación entre otros estados de la app.
- **Local state:** useState para formularios y UI temporal.
- Los hooks encapsulan toda la lógica de negocio de cada feature.

---

## 6️⃣ Estilos y UI

- **Sass** con enfoque mobile-first.
- Componentes genéricos reutilizables en `components/`.
- UI específica de feature en `features/<feature>/components/`.
- Nombres de clases semánticos y consistentes.
- Variables globales para colores principales (main, secondary) y soporte para light/dark mode.

---

## 7️⃣ Buenas prácticas, convenciones y tooling interno

- Componentes presentacionales separados de hooks con lógica.
- Tipado estricto en TypeScript, evitando `any`.
- Hooks encapsulan lógica de negocio; los componentes solo reciben props.
- DRY: reutiliza componentes, hooks y funciones.
- Naming consistente: PascalCase para componentes, camelCase para hooks/funciones.
- ESLint + Prettier para lint y formateo.
- Commits claros y descriptivos, idealmente siguiendo Conventional Commits.
- Documenta funciones y hooks importantes.
- Evita acoplar componentes directamente al backend.

---

## 8️⃣ Flujo del MVP (a la fecha)

0. Landing Page  
1. Registro de usuario → login.

---

## 9️⃣ Configuración: Prettier y ESLint

Antes de comenzar el desarrollo, asegúrate de tener configurado tu entorno correctamente para mantener un formato y calidad de código consistentes con el proyecto.

### Extensiones recomendadas para VS Code

Al abrir el proyecto en **VS Code**, aparecerá una notificación recomendando instalar las siguientes extensiones:

- **Prettier – Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

Instalar estas extensiones permite **formateo automático al guardar** y **verificación de reglas en tiempo real**.

El proyecto incluye los siguientes archivos de configuración:

- `.prettierrc` → define el estilo de formato del código (comillas, punto y coma, indentación, etc.)
- `.eslintrc.js` → define las reglas de calidad y buenas prácticas en el código
- `.vscode/settings.json` → asegura que todos los desarrolladores usen el mismo formateador y tamaño de tabulación

Estos archivos garantizan una experiencia de desarrollo uniforme para todo el equipo.

---

## 🔟 Notas adicionales

- `.env` en la raíz del proyecto, accesible globalmente para todas las features.
- Cada feature funciona como un mini-módulo, permitiendo escalabilidad y mantenimiento independiente.
- Se recomienda revisar este documento cada vez que se incorpore un nuevo desarrollador para mantener la consistencia y comprensión del código.

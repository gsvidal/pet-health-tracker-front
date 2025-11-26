# Pet Health Tracker - Requerimientos del Cliente

## 📋 Información General

**Nombre del Proyecto:** Pet Health Tracker  
**Sector de Negocio:** Petcare

## 🎯 Necesidad del Cliente

Los dueños de mascotas buscan una plataforma digital que les permita registrar y controlar información clave sobre la salud de sus mascotas, como vacunación, alimentación, citas veterinarias y recordatorios.

## 🎯 Objetivo

Permitir a dueños de mascotas gestionar de forma centralizada la salud y el bienestar de sus animales: perfiles por mascota, registro de vacunaciones y visitas, plan de alimentación y recordatorios automáticos para eventos médicos y nutricionales.

---

## ⚙️ Requerimientos Funcionales

### 1. Gestión de Usuarios

- Registro e inicio de sesión con correo y contraseña.
- Opción de recuperación de contraseña.

### 2. Perfil de Mascota

- Crear, editar y eliminar perfiles de mascotas.
- Campos: nombre, especie, raza, edad, peso, foto.

### 3. Registro de Salud

- Cargar información de vacunación, desparasitación y visitas al veterinario.
- Adjuntar documentos o imágenes (opcional).

### 4. Seguimiento Nutricional

- Registrar comidas o dietas.
- Recordatorios de horarios de alimentación.

### 5. Recordatorios Automáticos

- Sistema de alertas por correo o notificación in-app.
- Calendario de eventos próximos.

### 6. Dashboard

- Vista general con resumen del estado de salud, próximas vacunas y alertas activas.

---

## 🧠 Requerimientos No Funcionales

- **Usabilidad:** interfaz intuitiva, mobile-first.
- **Escalabilidad:** estructura lista para agregar más funcionalidades (seguimiento de actividad física, integración con wearables, etc.).
- **Seguridad:** cifrado de contraseñas y validación de datos.
- **Performance:** respuesta ágil, incluso con múltiples registros.

---

## 📦 Entregables Esperados

1. Ficha de producto / flujo UX con pantallas clave (registro, perfil mascota, formulario de evento, calendario, dashboard).
2. API contract (lista de endpoints con request/response ejemplo).
3. Prototipo interactivo o demo funcional (registro → crear mascota → añadir vacuna → ver recordatorio).

---

## 📝 Notas

- Este documento es la **fuente de la verdad** para los requerimientos del proyecto.
- Los requerimientos no cambiarán durante el desarrollo del MVP.
- Todas las decisiones de desarrollo deben alinearse con estos requerimientos.


EXTRA: 
Project documentation (deliverable)

CU04 – Registro de Vacunación:

Dado que el usuario ve el perfil de su mascota (pet/:id).
Cuando agrega una nueva vacuna con fecha de próxima dosis.
Y pulsa “Guardar”.
Entonces el registro aparece en el historial(en la misma pagina pet/:id).
Y se crea un recordatorio automático.


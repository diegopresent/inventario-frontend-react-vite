# 📦 Sistema Avanzado de Gestión de Inventario - Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

Este repositorio contiene el código fuente del **Frontend** de una aplicación Single Page Application (SPA) dedicada a la administración integral de inventarios. Está diseñada para ser consumida por empresas o negocios que necesitan un control riguroso de su mercancía, categorización de productos y, sobre todo, una **auditoría estricta de los movimientos de stock**.

---

## 📑 Índice Exhaustivo

1. [Visión General y Propósito del Proyecto](#1-visión-general-y-propósito-del-proyecto)
2. [Stack Tecnológico y Justificación Arquitectónica](#2-stack-tecnológico-y-justificación-arquitectónica)
3. [Análisis Profundo de la Estructura de Directorios](#3-análisis-profundo-de-la-estructura-de-directorios)
4. [Patrones de Diseño y Arquitectura de Software (SOLID)](#4-patrones-de-diseño-y-arquitectura-de-software-solid)
5. [Análisis Detallado por Componente y Módulo](#5-análisis-detallado-por-componente-y-módulo)
6. [Flujo de Datos y Gestión del Estado](#6-flujo-de-datos-y-gestión-del-estado)
7. [Seguridad, Autenticación y Control de Accesos (RBAC)](#7-seguridad-autenticación-y-control-de-accesos-rbac)
8. [Historia de Construcción: De Cero a Producción](#8-historia-de-construcción-de-cero-a-producción)
9. [Guía de Instalación y Configuración para Desarrolladores](#9-guía-de-instalación-y-configuración-para-desarrolladores)
10. [Despliegue a Producción (Guía Definitiva)](#10-despliegue-a-producción-guía-definitiva)

---

## 1. Visión General y Propósito del Proyecto

El sistema nace de la necesidad de abandonar las hojas de cálculo propensas a errores humanos y pasar a una plataforma centralizada y validada. 

**Objetivos de Negocio que resuelve:**
- **Prevención de Pérdidas:** Al requerir un "motivo" para cada alteración de stock, se mitiga el robo hormiga o las pérdidas no documentadas.
- **Trazabilidad:** Cada movimiento de inventario (venta, reabastecimiento, ajuste) queda registrado con fecha, hora y el usuario exacto que lo realizó.
- **Eficiencia Operativa:** Un buscador en tiempo real y una paginación optimizada permiten gestionar catálogos de miles de productos sin ralentizar el navegador del usuario.
- **Jerarquía y Seguridad:** Un sistema de roles donde un empleado estándar (USER) puede vender, pero solo un administrador (ADMIN) puede crear, editar catálogos o eliminar registros del sistema.

---

## 2. Stack Tecnológico y Justificación Arquitectónica

Cada herramienta en este proyecto fue seleccionada por razones específicas que benefician tanto el rendimiento de la aplicación como la experiencia de desarrollo (DX).

### Core y Entorno
- **React 18:** Elegido por su inmenso ecosistema y su arquitectura basada en componentes. La versión 18 introduce características como el *Automatic Batching* que mejora el rendimiento al agrupar múltiples actualizaciones de estado en un solo re-render.
- **Vite:** Reemplaza a Webpack. Vite sirve el código fuente sobre ES Modules (ESM) nativos durante el desarrollo. Esto significa que no empaqueta toda la aplicación cada vez que guardas un archivo, haciendo que el *Hot Module Replacement* (HMR) tome milisegundos sin importar el tamaño del proyecto. Para producción, usa Rollup, garantizando bundles altamente optimizados.

### Estilos y UI
- **Tailwind CSS:** En lugar de usar preprocesadores tradicionales (SASS/LESS) o metodologías como BEM, Tailwind permite construir diseños directamente en el JSX mediante clases utilitarias. 
  - *¿Por qué?* Evita el crecimiento infinito de archivos CSS, asegura un sistema de diseño consistente (espaciados y colores estandarizados) y el compilador purga cualquier clase no utilizada, resultando en un archivo CSS de producción de apenas unos pocos kilobytes.
- **SweetAlert2:** Para las confirmaciones e interacciones modales rápidas. Se prefirió sobre los diálogos del navegador (`alert`, `confirm`) porque el hilo de ejecución de JS no se bloquea y provee una interfaz consistente en todos los navegadores.

### Comunicación HTTP y Enrutamiento
- **Axios:** Cliente HTTP basado en promesas.
  - *¿Por qué no fetch?* Axios permite crear "Instancias" y configurar "Interceptors". Esto es vital para nuestra arquitectura de seguridad: interceptamos cada petición antes de que salga para inyectarle silenciosamente el Token JWT en los headers, limpiando el código de los componentes.
- **React Router DOM v6:** Fundamental para transformar una página web tradicional en una SPA. Gestiona el historial de navegación, permite crear componentes de protección de rutas (Guards) y manejar layouts anidados sin recargar el DOM completo.

---

## 3. Análisis Profundo de la Estructura de Directorios

La estructura no es aleatoria; sigue el principio de **Agrupación por Tipo Técnico** pero respetando la separación de lógica y vista.

```text
C:\...\inventario-frontend\
├── index.html               # El punto de entrada real del navegador. Define el <div id="root">.
├── vite.config.js           # Configuración del bundler (plugins de React, puertos, alias).
├── tailwind.config.js       # Define el sistema de diseño, colores extendidos y dónde buscar clases.
├── src/
│   ├── main.jsx             # El "Bootstrap" de React. Conecta la app con el DOM del index.html.
│   ├── App.jsx              # El Orquestador de Rutas. Mapea URLs a "Pages".
│   ├── index.css            # Solo importa las capas base, componentes y utilidades de Tailwind.
│   │
│   ├── api/
│   │   └── axios.js         # Configuración del puente de comunicación con el backend.
│   │
│   ├── components/          # PIEZAS DE LEGO. Componentes que no saben en qué página están.
│   │   ├── CategoryModal.jsx# Formulario encapsulado para crear/editar categorías.
│   │   ├── ProductModal.jsx # Formulario complejo con manejo de imágenes (FormData).
│   │   ├── StockActionModal # Modal multi-propósito (Ventas o Ingresos según la prop 'mode').
│   │   ├── Sidebar.jsx      # Navegación principal.
│   │   └── ProtectedRoute.jsx# Componente Wrapper. Si no hay token, expulsa al usuario al Login.
│   │
│   ├── hooks/               # EL CEREBRO. Donde vive la lógica de negocio pura.
│   │   ├── useProducts.js   # Maneja estados: productos, paginación, filtros, llamadas a Axios.
│   │   └── useCategories.js # Maneja el CRUD de categorías y su paginación/búsqueda.
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx   # La plantilla. Define dónde va el Sidebar y dónde el contenido hijo (<Outlet />).
│   │
│   └── pages/               # VISTAS DE RUTA. Ensamblan Hooks + Components + Layouts.
│       ├── LoginPage.jsx    # Maneja la captura de credenciales y la escritura en localStorage.
│       ├── RegisterPage.jsx # Vista de creación de usuarios.
│       ├── DashboardPage.jsx# Panel general (Métricas, gráficos a futuro).
│       ├── ProductsPage.jsx # El controlador de la vista de inventario. Pinta la tabla de productos.
│       └── CategoriesPage.jsx# El controlador de la vista de categorías.
```

---

## 4. Patrones de Diseño y Arquitectura de Software (SOLID)

Este proyecto aspira a mantener un código limpio separando rigurosamente las responsabilidades (SoC - Separation of Concerns).

### Aplicación del Single Responsibility Principle (SRP)
En un enfoque de React tradicional (mal hecho), un archivo como `ProductsPage.jsx` tendría:
1. El estado de la lista de productos (`useState`).
2. Las funciones `fetch` para ir al backend (`useEffect`).
3. El marcado HTML de la tabla (`return <div>...`).
4. El marcado HTML del modal de creación.

**Cómo lo resolvimos:**
- **Extracción de Lógica:** Toda la lógica de "Cómo conseguir los datos" y "Cómo enviarlos" se extrajo a `src/hooks/useProducts.js`. La vista solo dice `const { products, saveProduct } = useProducts()`. No le importa *cómo* se guardan, solo que hay una función para hacerlo.
- **Desacoplamiento UI:** Los formularios no flotan en la página principal. Fueron extraídos a `ProductModal.jsx`. 

### Inversión de Control (IoC) y Composición
El componente `MainLayout` y `ProtectedRoute` utilizan el patrón de renderizado de hijos (`<Outlet />` de React Router). Ellos dictan las reglas del marco (mostrar menú o verificar permisos), y los componentes hijos simplemente se inyectan en el espacio designado.

### Limpieza de Ciclo de Vida (useEffect Cleanup)
Se resolvió un problema común en SPAs: el "arrastre de estado". 
Cuando un componente Modal (como `CategoryModal.jsx`) se abre, un `useEffect` se dispara para autocompletar los campos si estamos "Editando" o limpiar los campos si estamos "Creando". Al cerrar el modal, el componente padre (`ProductsPage.jsx`) invoca una función que resetea la referencia a `null`. Esto asegura que nunca se abra el modal mostrando la información del producto anterior.

---

## 5. Análisis Detallado por Componente y Módulo

### El Motor de Peticiones: `api/axios.js`
Este archivo es crucial. No exporta las funciones de obtener productos, exporta el **cliente mismo**.
```javascript
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
// Interceptor: Antes de cada petición HTTP...
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    // Si hay un token guardado, inyéctalo en el header 'Authorization' como 'Bearer <token>'
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```
*Propósito:* Evita que el desarrollador tenga que recordar poner el token en cada uno de los 20+ llamados a la API del proyecto.

### Hooks de Negocio (`useProducts` y `useCategories`)
Son funciones que devuelven un objeto con datos e interfaces de interacción.
Contienen estados complejos, como `pagination` y `search`.
Manejan el control de carga (`loading`). Cuando una petición a Axios inicia, `loading` pasa a `true`, lo que la Vista lee para desactivar botones de "Guardar" y evitar doble submit. Al terminar (en un bloque `finally`), vuelve a `false`.

### Componentes Modales (Ej. `ProductModal.jsx`)
Manejan formularios complejos. En el caso de productos, requiere subir imágenes. Por tanto, no se envía un JSON estándar al backend, sino un objeto `FormData` nativo del navegador, anexando el archivo binario (`form.imagen`) junto con los datos de texto (nombre, stock, categoría).

---

## 6. Flujo de Datos y Gestión del Estado

Tomemos como ejemplo la **creación de una nueva categoría**:

1. **Usuario interactúa:** El usuario hace clic en "+ Nueva Categoría" en `CategoriesPage.jsx`.
2. **Cambio de Estado Visual:** La vista cambia el estado local `isModalOpen` a `true` y `editingCategory` a `null`.
3. **Renderizado Reactivo:** React detecta el cambio de estado y renderiza el componente `CategoryModal.jsx`.
4. **Sincronización:** El `useEffect` dentro del Modal detecta que se abrió y que no hay categoría para editar. Vacía su estado interno de formulario (Input queda en blanco).
5. **Captura de Datos:** El usuario escribe "Electrónica" y presiona "Guardar".
6. **Delegación de Responsabilidad:** El Modal previene la recarga (`e.preventDefault()`) y llama a la prop `onSave(formData)`.
7. **Intervención del Hook:** `CategoriesPage` recibe los datos y se los pasa a `saveCategory(formData)`, función que vino del hook `useCategories`.
8. **Comunicación de Red:** El Hook realiza un `api.post('/categories', data)`. Axios inyecta el token y hace la llamada.
9. **Respuesta y Refresco:** El backend responde HTTP 201 Created. El Hook lanza un SweetAlert de éxito y, **críticamente**, llama a su propia función `fetchCategories()` para traer la lista actualizada de la base de datos.
10. **Re-render Final:** La lista de categorías en el Hook cambia, lo que causa que `CategoriesPage` se re-renderice, mostrando la nueva categoría en la tabla.

---

## 7. Seguridad, Autenticación y Control de Accesos (RBAC)

La aplicación implementa una seguridad profunda en el frontend (aunque asume que el backend hace la verdadera validación).

1. **Autenticación (Quién eres):**
   Al hacer Login, el backend devuelve un usuario y un Token JWT. Estos se guardan en el `localStorage`.
   El componente `ProtectedRoute.jsx` envuelve las rutas privadas. Si un usuario intenta tipear la URL `/productos` y no tiene token, el enrutador bloquea el renderizado y lo redirecciona inmediatamente a `/login`.

2. **Autorización (Qué puedes hacer - RBAC):**
   El sistema implementa Role-Based Access Control basado en el rol del usuario guardado (`ADMIN` vs `USER`).
   En las páginas de productos y categorías, se evalúa:
   ```javascript
   const user = JSON.parse(localStorage.getItem('user') || '{}');
   const isAdmin = user.rol === 'ADMIN';
   ```
   Luego, en la vista:
   ```javascript
   {isAdmin && (
       <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
   )}
   ```
   Esto garantiza que los botones destructivos ni siquiera existan en el DOM para un usuario estándar.

---

## 8. Historia de Construcción: De Cero a Producción

El proyecto se construyó siguiendo una metodología ágil iterativa:

1. **Scaffolding:** Se inicializó con `npm create vite@latest` utilizando el template de React con JavaScript puro.
2. **Configuración del Sistema de Diseño:** Se integró Tailwind CSS y se modificaron las variables globales en `index.css` (para resets) y `tailwind.config.js`.
3. **Infraestructura de Enrutamiento:** Se definió la navegación global antes de construir las páginas, estableciendo el sistema de Layouts para evitar repetir código estructural.
4. **Desarrollo de Servicios Base:** Se creó la instancia de Axios antes de cualquier componente visual. Sin esto, no hay flujo de datos.
5. **Implementación de Hooks Custom:** Se programaron los hooks `useProducts` simulando datos temporales antes de conectarlos a la API real.
6. **Construcción de UI y Componentes:** Se maquetaron las tablas y los modales.
7. **Refinamiento de Ciclos de Vida (El Gran Reto):** Se identificó un bug crítico donde los formularios retenían datos antiguos al cambiar entre "Crear" y "Editar". Se implementó una refactorización estricta utilizando dependencias precisas en los `useEffect` de los modales y limpieza de estados nulos (`setEditingProduct(null)`) en las funciones de cierre de los componentes padre.
8. **Estandarización de Funcionalidades:** Se implementó búsqueda en tiempo real y paginación desde el servidor tanto para productos como para categorías, garantizando escalabilidad independientemente del volumen de datos.

---

## 9. Guía de Instalación y Configuración para Desarrolladores

Si vas a descargar este proyecto para modificar el código fuente, sigue estos pasos rigurosamente.

### Prerrequisitos del Sistema
- **Node.js:** Versión 18.x (LTS) o superior. Obligatorio por el soporte de fetch nativo en herramientas subyacentes de Vite.
- **Gestor de paquetes:** Recomendado `npm` (incluido con Node), aunque `yarn` o `pnpm` funcionarán sin problema.
- **Git:** Para clonar el repositorio.

### Pasos de Instalación

1. **Clonar el Repositorio de Código Fuente:**
   ```bash
   git clone https://github.com/TuUsuario/inventario-frontend.git
   ```

2. **Acceder al Directorio y Resolver Dependencias:**
   ```bash
   cd inventario-frontend
   npm install
   ```
   *Esto leerá el archivo `package.json` y descargará localmente React, Vite, Tailwind, Axios, etc., dentro de la carpeta oculta `node_modules`.*

3. **Configuración de Conexión (Variables de Entorno):**
   Vite requiere que cualquier variable accesible en el código fuente comience con `VITE_`.
   Crea un archivo de texto plano llamado exactamente `.env` en la carpeta raíz (al mismo nivel que `package.json`).
   ```env
   # Archivo .env
   # Reemplaza esta URL con la ruta de tu servidor backend local o remoto
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Levantar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   La consola te devolverá una URL local (generalmente `http://localhost:5173`). Ábrela en tu navegador. Vite utilizará HMR; si cambias un color en el código y guardas, se reflejará instantáneamente sin recargar la página.

---

## 10. Despliegue a Producción (Guía Definitiva)

Una SPA construida con React y Vite no necesita un servidor Node.js en producción para ejecutarse. Al compilarse, se transforma en un conjunto estático de archivos `.html`, `.js` y `.css`. Esto la hace perfecta para hospedarla en servicios de CDN globales, rápidos y gratuitos.

### Compilación Local (Para probar)
Si quieres ver qué se subirá al servidor:
```bash
npm run build
npm run preview
```
El comando `build` generará una carpeta `dist/`. Es **estrictamente esa carpeta** la que se sube a producción.

### Despliegue Automatizado en Vercel (Opción recomendada por rendimiento y CI/CD)

Vercel es una plataforma de nube optimizada para frameworks frontend.

1. Sube tu código (la carpeta del proyecto, sin la carpeta `node_modules` ni `dist`) a un repositorio en **GitHub**, **GitLab** o **Bitbucket**.
2. Crea una cuenta en [Vercel](https://vercel.com/) vinculando tu cuenta de Git.
3. En el panel de Vercel, haz clic en **"Add New" > "Project"**.
4. Selecciona tu repositorio de la lista. Vercel analizará el código y detectará automáticamente que es un proyecto construido con **Vite**.
5. **PASO CRÍTICO - Configuración de Entorno:**
   Antes de darle a "Deploy", abre la sección **Environment Variables**.
   Debes agregar la ruta de tu backend en producción, ya que en la nube `localhost` no existe.
   - **Key:** `VITE_API_URL`
   - **Value:** `https://api.tu-dominio-backend.com/api` (Ejemplo).
6. Haz clic en **Deploy**. Vercel ejecutará `npm install` y `npm run build` en sus servidores y en menos de 2 minutos te entregará una URL pública segura (HTTPS).
7. Cada vez que hagas un `git push` a tu rama principal (`main` o `master`), Vercel detectará el cambio y redesplegará la aplicación automáticamente sin tiempo de inactividad (Zero Downtime Deployment).

### El Problema de las Rutas (Catch-All Redirect)
Si despliegas en un servidor propio (Apache, Nginx) o plataformas como Netlify, encontrarás un error: Si navegas por los botones llegas a `/productos`, pero si recargas la página con F5, el servidor arrojará un error 404 Not Found.

*¿Por qué?* Porque la carpeta física `/productos` no existe. Todo el enrutamiento es una ilusión óptica creada por React Router manipulando la barra de direcciones del navegador mediante la History API de HTML5.

*La Solución:* Debes configurar el servidor de producción para que, ante cualquier URL que no sea un archivo físico, siempre devuelva el `index.html` original. React Router leerá la URL al cargar y mostrará la página correcta.
- **En Netlify:** Crea un archivo llamado `_redirects` en la carpeta `public/` con esta línea:
  `/*    /index.html   200`
- **En Vercel:** Vite y Vercel lo manejan automáticamente por defecto gracias a la configuración base, no suele requerir acciones extra.

---

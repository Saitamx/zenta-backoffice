# Zenta Backoffice (Frontend)

Backoffice de administración de CMPC-libros, construido con **React + TypeScript**.

Versión desplegada: https://zenta-backoffice.vercel.app/login  
Usuario demo: `admin@example.cl` · Password: `123456`

## Instalación y ejecución local

```bash
yarn install
```

Crea un archivo `.env` en la raíz:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

Arranca el front:

```bash
yarn start
```

Build de producción:

```bash
yarn build
```

La app consume la API del backend `zenta-cmpc-service` para login y gestión de libros (listado con filtros, alta/edición y exportación CSV).


# Frontend ACME

Proyecto inicializado con React 18 + Vite + TypeScript.

## Requisitos Previos
- Node.js >= 18 (recomendado 18.x o 20.x). Verifica con `node -v`.
- npm >= 9 (`npm -v`). (Puedes usar pnpm o yarn si prefieres, adapta comandos.)
- Git instalado para control de versiones.

## Instalación
Clona el repositorio y luego instala dependencias:
```powershell
git clone <URL_DEL_REPO>
cd Frontend_ACME
npm install
```

## Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo (Vite) en modo hot reload.
- `npm run build`: Genera el build optimizado en `dist`.
- `npm run preview`: Sirve localmente el build ya generado.
- `npm run lint`: Ejecuta ESLint sobre archivos `ts/tsx`.
- `npm run format`: Aplica formato con Prettier.

## Estructura Básica
```
index.html        # Punto de entrada Vite
src/
	main.tsx        # Monta la aplicación React
	App.tsx         # Componente raíz de ejemplo
	components/     # Carpeta para tus componentes
```

## Convenciones de Código
- TypeScript estricto (`strict: true`).
- ESLint + @typescript-eslint + reglas React.
- Prettier para formato consistente.
- Importaciones ES Modules (package.json `type: module`).

## Desarrollo
Inicia el servidor de desarrollo:
```powershell
npm run dev
```
Abre el navegador en la URL que indique Vite (generalmente `http://localhost:5173`).

## Build de Producción
```powershell
npm run build
```
Luego puedes previsualizar:
```powershell
npm run preview
```

## Lint y Formato
```powershell
npm run lint
npm run format
```

## Variables de Entorno
Crea archivos `.env` (ignorados por Git) para configurar valores (ejemplo: API_URL). En Vite deben iniciar con `VITE_` para ser accesibles en el código (`import.meta.env.VITE_API_URL`).

## Próximos Pasos Sugeridos
- Añadir routing (React Router) si se requieren múltiples vistas.
- Configurar pruebas (Vitest / Testing Library) si se necesitan tests.
- Integrar manejo de estado (Zustand, Redux Toolkit, etc.).

---
Si necesitas ampliar la configuración (tests, CI/CD, Docker), pídelo y lo añadimos.
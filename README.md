# Hotel de paso f

Aplicación de escritorio con Electron + Vite + React + Tailwind CSS + Django REST Backend

## 📋 Requisitos previos

- Node.js >= 18.17.0
- npm >= 9.0.0
- Backend Django corriendo (ver configuración abajo)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/CarlosMtz27/hotel-paso-frontend
cd my-electron-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend Django.

## 💻 Desarrollo

Ejecutar en modo desarrollo:
```bash
npm run electron:dev
```

Esto iniciará:
- Vite dev server (React app)
- Electron app

## 🏗️ Build

Crear ejecutable:
```bash
npm run electron:build
```

## 📁 Estructura del proyecto
```
src/
├── main/           # Proceso principal de Electron
├── renderer/       # Aplicación React
│   └── src/
│       ├── api/         # Cliente API Django
│       ├── components/  # Componentes React
│       ├── features/    # Módulos por funcionalidad
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Páginas
│       └── store/       # Estado global
└── shared/         # Código compartido
```

## 🔧 Scripts disponibles

- `npm run dev` - Vite dev server
- `npm run electron:dev` - Desarrollo Electron + Vite
- `npm run build` - Build de producción
- `npm run lint` - Verificar código
- `npm run preview` - Preview del build

## 🤝 Contribuir

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

## 📝 Convenciones

- Usar Prettier para formato (se ejecuta automáticamente al guardar)
- Seguir reglas de ESLint
- Commits descriptivos en español
```

---

# PASO 13: Crear archivo de variables de entorno

Crea `.env.example`:
```
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
```

Crea `.env` (este NO se sube a git):
```
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

![portada](https://github.com/ignacioleiva66-ai/licitasegura/blob/bcd63484629fa7a0e92ca08bde40114897c047a2/Captura%20de%20pantalla%202026-06-12%20194350.png)
link:https://github.com/ignacioleiva66-ai/licitasegura

# LicitaSeguro 🏛️

**Portal público de acceso a licitaciones de Mercado Público – Chile**

> Proyecto final de Desarrollo Frontend · Instituto Profesional San Sebastián

---

## 📋 Descripción

LicitaSeguro es un sitio web público que permite a usuarios consultar y navegar licitaciones del Estado de Chile a través de la API oficial de Mercado Público (ChileCompra), sin necesidad de acceder directamente a la plataforma gubernamental.

---

## ✅ Tareas Implementadas

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| **Tarea 1** | Mockups de vistas (incluidos en informe) | ✅ |
| **Tarea 2** | Vistas responsivas (mobile, tablet, laptop) | ✅ |
| **Tarea 3** | Validación de formularios + loader + paginación | ✅ |
| **Tarea 4** | Validación de RUT + consumo de endpoints | ✅ |
| **Tarea 5** | Labels, atributos ARIA, tabindex, accesibilidad | ✅ |
| **Tarea 6** | Limpieza de respuestas API, tildes, manejo de errores | ✅ |
| **Tarea 7** | Documentación (este README + informe PDF) | ✅ |

---

## 🗂️ Estructura del Proyecto

```
licitaseguro/
├── index.html                  # Homepage corporativo
├── pages/
│   ├── licitaciones.html       # Listado y filtro de licitaciones
│   ├── detalle.html            # Detalle de licitación por código
│   └── proveedores.html        # Búsqueda de proveedor por RUT
├── css/
│   └── styles.css              # Design system completo
├── js/
│   ├── utils.js                # API helper, loader, paginación, utilidades
│   └── rut.js                  # Validador de RUT chileno
└── README.md
```

---

## 🌐 Módulos del Sistema

### 1. Homepage (`index.html`)
- Página corporativa con hero section
- Cards de acceso a cada módulo
- Sección "Acerca de" con descripción del proyecto
- Navbar responsiva con menú hamburguesa

### 2. Listado de Licitaciones (`pages/licitaciones.html`)
- Filtro por **fecha** (validada: obligatoria, no futura, máx. 2 años atrás)
- Filtro por **estado** (activa, publicada, cerrada, desierta, adjudicada, revocada, suspendida)
- Loader animado durante la consulta API
- Tabla responsiva con paginación automática (>10 resultados)
- Mensajes de error detallados por caso
- Botón "Ver Detalle" enlaza a página de detalle con código precargado

### 3. Detalle de Licitación (`pages/detalle.html`)
- Búsqueda por código de licitación
- Validación de formato de código
- Renderiza información completa: código, tipo, estado, fechas, descripción, comprador, montos
- Tabla de ítems de la licitación
- Link directo a Mercado Público oficial
- Puede recibir código por URL param (`?codigo=...`)

### 4. Buscar Proveedor (`pages/proveedores.html`)
- Búsqueda por RUT con **validación completa** del dígito verificador
- Formateo automático del RUT mientras se escribe (`77.653.382-3`)
- Mensajes de error específicos por caso (RUT vacío, formato inválido, DV incorrecto, rango)
- Muestra datos completos del proveedor

---

## 🔌 Endpoints API Utilizados

### API Base
`https://api.mercadopublico.cl/servicios/v1/publico`

Ticket de autenticación: `AC3A098B-4CD0-41AF-81A5-41284248419B`

### 1. Listado de Licitaciones
```
GET https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json
  ?fecha=DDMMYYYY
  &estado=activa|publicada|cerrada|desierta|adjudicada|revocada|suspendida
  &ticket=AC3A098B-4CD0-41AF-81A5-41284248419B
```

### 2. Detalle de Licitación
```
GET https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json
  ?codigo=1057539-17-LR25
  &ticket=AC3A098B-4CD0-41AF-81A5-41284248419B
```

### 3. Buscar Proveedor por RUT
```
GET https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor
  ?rutempresaproveedor=77.653.382-3
  &ticket=AC3A098B-4CD0-41AF-81A5-41284248419B
```

---

## ♿ Accesibilidad (WCAG 2.1 AA)

- **Skip Link**: "Saltar al contenido principal" en cada página
- **Landmarks**: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>` con `aria-label`
- **Labels**: Todos los inputs tienen `<label>` asociado con `for`/`id`
- **ARIA**: `aria-required`, `aria-invalid`, `aria-describedby`, `aria-live`, `aria-current`, `aria-expanded`, `aria-label`, `role="alert"`, `role="status"`
- **Tabindex**: Navegación completa por teclado (`tabindex="0"` en elementos interactivos)
- **Focus visible**: Indicador de foco visible en todos los elementos interactivos
- **Contraste**: Colores cumplen ratio ≥ 4.5:1 (texto sobre fondos)
- **Textos alternativos**: `aria-hidden="true"` en íconos decorativos

---

## 📱 Diseño Responsivo

| Breakpoint | Comportamiento |
|-----------|----------------|
| **Mobile** (`< 480px`) | Stack vertical, menú hamburguesa, tabla como cards |
| **Tablet** (`480–768px`) | Grid adaptativo, formularios en columna |
| **Laptop** (`> 768px`) | Layout completo con tabla y grids multi-columna |

---

## 🎨 Design System

### Paleta de Colores
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#0a2d5e` | Azul institucional |
| `--color-accent` | `#c8922a` | Dorado acento |
| `--color-bg` | `#f4f6fb` | Fondo general |
| `--color-success` | `#1a7a4a` | Éxito |
| `--color-danger` | `#b91c1c` | Error |

### Tipografía
- **Display**: Sora (títulos, labels, botones) — cargada desde Google Fonts
- **Body**: Source Sans 3 (textos, párrafos) — cargada desde Google Fonts

---

## 🛡️ Validaciones Implementadas

### Formulario Licitaciones
| Campo | Validaciones |
|-------|-------------|
| Fecha | Obligatoria · No puede ser futura · Máximo 2 años atrás · Formato válido |
| Estado | Opcional, lista controlada |

### Formulario Detalle
| Campo | Validaciones |
|-------|-------------|
| Código | Obligatorio · Solo alfanumérico y guiones · Mínimo 5 caracteres |

### Formulario Proveedor (RUT)
| Caso | Mensaje |
|------|---------|
| Vacío | "El RUT del proveedor es obligatorio." |
| Demasiado corto | "El RUT ingresado es demasiado corto." |
| Caracteres inválidos | "El RUT contiene caracteres inválidos en el cuerpo." |
| DV inválido | "El dígito verificador solo puede ser un número o la letra K." |
| Rango incorrecto | "El RUT ingresado está fuera del rango válido (1.000.000 – 99.999.999)." |
| DV incorrecto | "El dígito verificador es incorrecto. Se esperaba 'X' pero se ingresó 'Y'." |

### Mensajes de Error API
| Situación | Mensaje |
|-----------|---------|
| Sin conexión / CORS | "No se pudo conectar con la API de Mercado Público." |
| 404 No encontrado | "No se encontraron resultados para los criterios ingresados." |
| 401/403 Auth | "Error de autenticación con la API." |
| 500 Server Error | "Error interno del servidor. Intenta nuevamente." |
| Respuesta vacía | Mensaje específico según contexto |

---

## 🔧 Tecnologías Usadas

- **HTML5** semántico
- **CSS3** con variables custom (sin frameworks)
- **JavaScript ES6+** (vanilla, sin dependencias)
- **Google Fonts** (Sora + Source Sans 3)
- **API REST** de Mercado Público (ChileCompra)

---

## 🚀 Cómo usar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/licitaseguro.git
   cd licitaseguro
   ```

2. **Abrir localmente:**
   - Abre `index.html` directamente en el navegador, **o**
   - Usa un servidor local para evitar restricciones CORS:
     ```bash
     # Con Python
     python -m http.server 8080
     # Con Node.js (npx serve)
     npx serve .
     # Con VS Code Live Server
     ```

3. **Navegar la aplicación:**
   - Ir a [http://localhost:8080](http://localhost:8080)

> **⚠️ Nota CORS:** La API de Mercado Público requiere ser consumida desde un servidor (no desde `file://`). Usa `npx serve .` o Live Server de VS Code.

---

## 📝 Notas del Proyecto

- El **ticket de API** incluido es el provisto en el instructivo del curso (`AC3A098B-4CD0-41AF-81A5-41284248419B`)
- Las respuestas de la API son limpiadas con la función `cleanObj()` para corregir problemas de encoding (tildes, ñ, etc.)
- La paginación se activa automáticamente cuando hay más de 10 resultados
- El proyecto no usa frameworks CSS ni JS para cumplir con los requisitos del examen (HTML + CSS + JS puro + Bootstrap **opcional**)

---

## 👥 Equipo

| Nombre | Rol |
|--------|-----|
| Integrante 1 | Frontend / UI |
| Integrante 2 | Integración API |
| Integrante 3 | Documentación / QA |

---
link del video:
https://ipciisa-my.sharepoint.com/:v:/g/personal/ignacio_leiva_cordero_estudiante_ipss_cl/IQByUJ9LN_5zRpP1Uk71LmAeAQR6TyNl2XB0Jxf8Jkz7OMA?e=Oimkbz&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

## 📄 Licencia

Proyecto académico – Instituto Profesional San Sebastián · 2026

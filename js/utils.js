/**
 * LicitaSeguro - utils.js
 * Funciones compartidas: API, RUT, loader, paginación, encoding
 */

'use strict';

// ============================================================
// CONFIG
// ============================================================
const CONFIG = {
  TICKET: 'AC3A098B-4CD0-41AF-81A5-41284248419B',
  BASE_API: 'https://api.mercadopublico.cl/servicios/v1/publico',
  PAGE_SIZE: 10,
  ESTADOS: [
    { value: '', label: 'Todos los estados' },
    { value: 'activa', label: 'Activa' },
    { value: 'publicada', label: 'Publicada' },
    { value: 'cerrada', label: 'Cerrada' },
    { value: 'desierta', label: 'Desierta' },
    { value: 'adjudicada', label: 'Adjudicada' },
    { value: 'revocada', label: 'Revocada' },
    { value: 'suspendida', label: 'Suspendida' },
  ],
};

// ============================================================
// LOADER
// ============================================================
const Loader = {
  show(msg = 'Cargando datos...') {
    const overlay = document.getElementById('loaderOverlay');
    const text = document.getElementById('loaderText');
    if (!overlay) return;
    if (text) text.textContent = msg;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
  },
  hide() {
    const overlay = document.getElementById('loaderOverlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  },
};

// ============================================================
// ENCODING — fix tildes y caracteres especiales
// ============================================================
function fixEncoding(str) {
  if (typeof str !== 'string') return str;
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str
      .replace(/Ã³/g, 'ó').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í')
      .replace(/Ã¡/g, 'á').replace(/Ãº/g, 'ú').replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Á').replace(/Ã‰/g, 'É').replace(/Ã/g, 'Í')
      .replace(/Ã"/g, 'Ó').replace(/Ãš/g, 'Ú').replace(/Ã'/g, 'Ñ')
      .replace(/\u00c3\u00b3/g, 'ó').replace(/\u00c3\u00a9/g, 'é');
  }
}

function cleanObj(obj) {
  if (Array.isArray(obj)) return obj.map(cleanObj);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = cleanObj(v);
    return out;
  }
  if (typeof obj === 'string') return fixEncoding(obj);
  return obj;
}

// ============================================================
// API HELPER
// ============================================================
async function apiFetch(url, loaderMsg) {
  if (loaderMsg) Loader.show(loaderMsg);
  try {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`Error HTTP ${resp.status}: ${resp.statusText}`);
    const raw = await resp.json();
    return cleanObj(raw);
  } catch (err) {
    throw err;
  } finally {
    Loader.hide();
  }
}

// Build URL for licitaciones listing
function buildLicitacionesUrl({ fecha = '', estado = '' } = {}) {
  const params = new URLSearchParams({ ticket: CONFIG.TICKET });
  if (fecha) params.set('fecha', fecha);
  if (estado) params.set('estado', estado);
  return `${CONFIG.BASE_API}/licitaciones.json?${params}`;
}

// Build URL for detail by code
function buildDetalleUrl(codigo) {
  return `${CONFIG.BASE_API}/licitaciones.json?codigo=${encodeURIComponent(codigo)}&ticket=${CONFIG.TICKET}`;
}

// Build URL for proveedor search
function buildProveedorUrl(rut) {
  const rutLimpio = rut.trim().replace(/ /g, '');
  return `${CONFIG.BASE_API.replace('/publico', '')}/Publico/Empresas/BuscarProveedor?rutempresaproveedor=${encodeURIComponent(rutLimpio)}&ticket=${CONFIG.TICKET}`;
}

// ============================================================
// FORMATO FECHA (ddmmaaaa → dd/mm/aaaa para mostrar)
// ============================================================
function formatFechaDisplay(str) {
  if (!str) return '—';
  // ISO format
  if (str.includes('T') || str.includes('-')) {
    const d = new Date(str);
    if (!isNaN(d)) return d.toLocaleDateString('es-CL');
  }
  return str;
}

function fechaInputToParam(dateValue) {
  // dateValue = 'YYYY-MM-DD' → 'DDMMYYYY'
  if (!dateValue) return '';
  const [y, m, d] = dateValue.split('-');
  return `${d}${m}${y}`;
}

function fechaParamToInput(param) {
  // 'DDMMYYYY' → 'YYYY-MM-DD'
  if (!param || param.length < 8) return '';
  const d = param.slice(0, 2), m = param.slice(2, 4), y = param.slice(4);
  return `${y}-${m}-${d}`;
}

// ============================================================
// BADGE DE ESTADO
// ============================================================
function buildBadge(estado) {
  const e = (estado || '').toLowerCase().trim();
  const classes = {
    activa: 'badge-activa',
    publicada: 'badge-publicada',
    cerrada: 'badge-cerrada',
    desierta: 'badge-desierta',
    adjudicada: 'badge-adjudicada',
    revocada: 'badge-revocada',
    suspendida: 'badge-revocada',
  };
  const cls = classes[e] || 'badge-default';
  return `<span class="badge ${cls}" aria-label="Estado: ${estado || 'Desconocido'}">${estado || 'Desconocido'}</span>`;
}

// ============================================================
// PAGINACIÓN
// ============================================================
function buildPagination(container, total, current, pageSize, onPageChange) {
  if (!container) return;
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '';

  // Prev
  html += `<button class="page-btn" ${current <= 1 ? 'disabled' : ''} 
    aria-label="Página anterior" tabindex="0" data-page="${current - 1}">&#8592;</button>`;

  // Pages (ventana deslizante)
  const delta = 2;
  const pages = new Set([1, totalPages]);
  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) pages.add(i);
  const sorted = [...pages].sort((a, b) => a - b);

  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) html += `<span class="page-btn" style="cursor:default;border:none;background:none" aria-hidden="true">…</span>`;
    html += `<button class="page-btn ${p === current ? 'active' : ''}" 
      aria-label="Página ${p}" aria-current="${p === current ? 'page' : 'false'}"
      tabindex="0" data-page="${p}">${p}</button>`;
    prev = p;
  }

  // Next
  html += `<button class="page-btn" ${current >= totalPages ? 'disabled' : ''}
    aria-label="Página siguiente" tabindex="0" data-page="${current + 1}">&#8594;</button>`;

  container.innerHTML = html;
  container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page);
      if (!btn.disabled && p !== current) onPageChange(p);
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });
}

// ============================================================
// MENSAJE DE ERROR API
// ============================================================
function buildErrorMsg(err) {
  const msg = err?.message || String(err);
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('CORS')) {
    return '⚠️ No se pudo conectar con la API de Mercado Público. Verifica tu conexión a internet.';
  }
  if (msg.includes('404')) return '🔍 No se encontraron resultados para los criterios ingresados.';
  if (msg.includes('401') || msg.includes('403')) return '🔒 Error de autenticación con la API.';
  if (msg.includes('500')) return '🚨 Error interno del servidor de Mercado Público. Intenta nuevamente.';
  return `❌ ${msg}`;
}

// ============================================================
// ALERT HELPER
// ============================================================
function showAlert(container, type, message) {
  if (!container) return;
  const icons = { danger: '⚠️', warning: '⚠️', info: 'ℹ️', success: '✅' };
  container.innerHTML = `
    <div class="alert alert-${type}" role="alert" aria-live="polite">
      <span class="alert-icon" aria-hidden="true">${icons[type] || 'ℹ️'}</span>
      <span>${message}</span>
    </div>`;
}

function clearAlert(container) {
  if (container) container.innerHTML = '';
}

// ============================================================
// NAV ACTIVE
// ============================================================
function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    nav.setAttribute('aria-hidden', !open);
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================================
// EXPORT (scope global para uso en múltiples archivos)
// ============================================================
window.LS = {
  CONFIG,
  Loader,
  fixEncoding,
  cleanObj,
  apiFetch,
  buildLicitacionesUrl,
  buildDetalleUrl,
  buildProveedorUrl,
  formatFechaDisplay,
  fechaInputToParam,
  fechaParamToInput,
  buildBadge,
  buildPagination,
  buildErrorMsg,
  showAlert,
  clearAlert,
  setActiveNav,
  initNavToggle,
};

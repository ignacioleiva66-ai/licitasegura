/**
 * LicitaSeguro - rut.js
 * Validación completa de RUT chileno con dígito verificador
 */

'use strict';

const RutValidator = (() => {

  /**
   * Limpia el RUT quitando puntos, guiones y espacios
   */
  function clean(rut) {
    return String(rut).replace(/[.\-\s]/g, '').toUpperCase().trim();
  }

  /**
   * Calcula el dígito verificador de un RUT
   * @param {string|number} rutBody - parte numérica sin DV
   * @returns {string} dígito verificador
   */
  function calcDv(rutBody) {
    let sum = 0;
    let mult = 2;
    const reversed = String(rutBody).split('').reverse();
    for (const d of reversed) {
      sum += parseInt(d) * mult;
      mult = mult < 7 ? mult + 1 : 2;
    }
    const remainder = 11 - (sum % 11);
    if (remainder === 11) return '0';
    if (remainder === 10) return 'K';
    return String(remainder);
  }

  /**
   * Valida si un RUT es correcto
   * @param {string} rut - RUT con o sin formato
   * @returns {{ valid: boolean, error: string|null, body: string, dv: string }}
   */
  function validate(rut) {
    const result = { valid: false, error: null, body: '', dv: '' };

    if (!rut || rut.trim() === '') {
      result.error = 'El RUT es obligatorio.';
      return result;
    }

    const cleaned = clean(rut);

    // Must have at least body + dv
    if (cleaned.length < 2) {
      result.error = 'El RUT ingresado es demasiado corto.';
      return result;
    }

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Body must be only digits
    if (!/^\d+$/.test(body)) {
      result.error = 'El RUT contiene caracteres inválidos en el cuerpo.';
      return result;
    }

    // DV must be digit or K
    if (!/^[\dK]$/.test(dv)) {
      result.error = 'El dígito verificador solo puede ser un número o la letra K.';
      return result;
    }

    const numBody = parseInt(body, 10);

    // Range check (1.000.000 – 99.999.999)
    if (numBody < 1000000 || numBody > 99999999) {
      result.error = 'El RUT ingresado está fuera del rango válido (1.000.000 – 99.999.999).';
      return result;
    }

    // Verify DV
    const expected = calcDv(body);
    if (dv !== expected) {
      result.error = `El dígito verificador es incorrecto. Se esperaba "${expected}" pero se ingresó "${dv}".`;
      return result;
    }

    result.valid = true;
    result.body = body;
    result.dv = dv;
    return result;
  }

  /**
   * Formatea un RUT limpio con puntos y guión
   */
  function format(rut) {
    const cleaned = clean(rut);
    if (cleaned.length < 2) return rut;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
  }

  /**
   * Formatea en tiempo real mientras el usuario escribe
   */
  function formatOnInput(input) {
    let val = input.value.replace(/[^0-9kK]/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    if (val.length <= 1) { input.value = val; return; }
    const body = val.slice(0, -1);
    const dv = val.slice(-1);
    input.value = format(body + dv);
  }

  /**
   * Inicializa la validación en un campo y su contenedor de error
   * @param {HTMLInputElement} input
   * @param {HTMLElement} errorEl - elemento donde mostrar el error
   * @param {Function} [onValid] - callback con rut formateado si es válido
   */
  function attachToInput(input, errorEl, onValid) {
    if (!input) return;

    // Format as user types
    input.addEventListener('input', () => {
      formatOnInput(input);
      input.classList.remove('is-invalid', 'is-valid');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
    });

    // Validate on blur
    input.addEventListener('blur', () => {
      if (!input.value.trim()) return; // Only validate if not empty (required handled by submit)
      const res = validate(input.value);
      if (!res.valid) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) { errorEl.textContent = res.error; errorEl.classList.add('show'); }
      } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
        input.value = format(input.value);
        if (onValid) onValid(clean(input.value));
      }
    });
  }

  return { validate, format, clean, calcDv, formatOnInput, attachToInput };
})();

window.RutValidator = RutValidator;

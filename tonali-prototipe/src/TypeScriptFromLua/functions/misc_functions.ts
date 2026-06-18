/**
 * @file misc_functions.ts
 * @description Funciones utilitarias misceláneas: RNG con semilla, formateadores, copia profunda, etc.
 */

/** Estado del generador pseudoaleatorio */
let _seed = 1;

/**
 * Establece la semilla para el RNG.
 * @param seed - Cadena o número de semilla
 * @returns Clave de semilla como cadena
 */
export function pseudoseed(seed: string | number): string {
  const s = typeof seed === 'string' ? hashString(seed) : seed;
  _seed = s;
  return String(s);
}

/**
 * Genera un número pseudoaleatorio entre 0 y 1 con la semilla dada.
 * @param seedKey - Clave de semilla
 * @returns Número entre 0 y 1
 */
export function pseudorandom(seedKey?: string): number {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return (_seed % 1000) / 1000;
}

/**
 * Selecciona un elemento aleatorio de un arreglo.
 * @param arr - Arreglo de elementos
 * @param seed - Semilla opcional
 * @returns Elemento seleccionado
 */
export function pseudorandomElement<T>(arr: T[], seed?: string): T {
  const idx = Math.floor(pseudorandom(seed) * arr.length);
  return arr[idx];
}

/**
 * Baraja un arreglo in-place con semilla.
 * @param arr - Arreglo a barajar
 * @param seed - Semilla para reproducibilidad
 */
export function pseudoshuffle<T>(arr: T[], seed?: string): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(pseudorandom(seed) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Copia profunda un objeto/arreglo.
 * @param obj - Objeto a copiar
 * @returns Copia independiente
 */
export function copyTable<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => copyTable(item)) as any;
  const copy: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = copyTable((obj as any)[key]);
    }
  }
  return copy;
}

/**
 * Formatea un número grande con sufijos (K, M, B, etc.).
 * @param num - Número a formatear
 * @returns Cadena formateada
 */
export function numberFormat(num: number): string {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'e15';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e4) return (num / 1e3).toFixed(1) + 'K';
  return String(Math.floor(num));
}

/**
 * Obtiene texto localizado por clave.
 * @param key - Clave de localización
 * @param type - Tipo ('poker_hands', etc.)
 * @returns Texto localizado o la clave misma
 */
export function localize(key: string, type?: string): string {
  // Implementación real buscaría en tablas de localización cargadas
  return key;
}

/**
 * Reproduce un efecto de sonido.
 * @param sound - Nombre del sonido
 * @param pitch - Pitch (1 = normal)
 * @param volume - Volumen (0-1)
 */
export function playSound(sound: string, pitch = 1, volume = 1): void {
  // Delegaría al SoundManager
}

/**
 * Remueve todos los elementos de un arreglo u objeto (limpieza).
 * @param collection - Arreglo u objeto a limpiar
 */
export function removeAll(collection: any[] | Record<string, any>): void {
  if (Array.isArray(collection)) {
    for (let i = collection.length - 1; i >= 0; i--) {
      const item = collection[i];
      if (item && typeof item.remove === 'function') item.remove();
    }
    collection.length = 0;
  } else if (collection) {
    for (const key of Object.keys(collection)) {
      const item = collection[key];
      if (item && typeof item.remove === 'function') item.remove();
      delete collection[key];
    }
  }
}

/**
 * Hash simple de cadena a número.
 * @param str - Cadena a hashear
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}


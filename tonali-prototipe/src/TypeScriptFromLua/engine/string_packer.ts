/**
 * @file string_packer.ts
 * @description Utilidades para empaquetar/desempaquetar datos en cadenas (serialización compacta).
 */

/**
 * Empaqueta un objeto en una cadena serializada.
 * @param data - Datos a empaquetar
 * @returns Cadena serializada
 */
export function STR_PACK(data: any): string {
  return JSON.stringify(data);
}

/**
 * Desempaqueta una cadena serializada a un objeto.
 * @param str - Cadena a desempaquetar
 * @returns Objeto reconstruido
 */
export function STR_UNPACK(str: string): any {
  try { return JSON.parse(str); } catch { return null; }
}


/**
 * @file conf.ts
 * @description Configuración principal del juego Balatro.
 * Define el modo de lanzamiento y los parámetros de la ventana del juego.
 */

/** Indica si el juego se encuentra en modo de lanzamiento (producción) */
export const RELEASE_MODE: boolean = true;

/** Indica si el juego está en modo demo */
export const DEMO: boolean = false;

/**
 * Interfaz de configuración de la ventana del juego
 */
export interface WindowConfig {
  /** Ancho inicial de la ventana (0 = automático) */
  width: number;
  /** Alto inicial de la ventana (0 = automático) */
  height: number;
  /** Ancho mínimo permitido de la ventana */
  minwidth: number;
  /** Alto mínimo permitido de la ventana */
  minheight: number;
}

/**
 * Interfaz de configuración general del juego
 */
export interface GameConfig {
  /** Mostrar consola de depuración */
  console: boolean;
  /** Título de la ventana del juego */
  title: string;
  /** Configuración de la ventana */
  window: WindowConfig;
}

/**
 * Genera la configuración del juego basándose en el modo de lanzamiento.
 * @returns La configuración completa del juego
 */
export function getGameConfig(): GameConfig {
  return {
    console: !RELEASE_MODE,
    title: 'Balatro',
    window: {
      width: 0,
      height: 0,
      minwidth: 100,
      minheight: 100,
    },
  };
}


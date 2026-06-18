/**
 * @file globals.ts
 * @description Variables globales, constantes, feature flags, estados del juego,
 * configuraciones de renderizado y colores utilizados en todo el proyecto Balatro.
 */

/** Versión actual del juego */
export const VERSION = '1.0.1o-FULL [M]';

// ═══════════════════════════════════════════
//              INTERFACES
// ═══════════════════════════════════════════

/** Configuración de temporización del juego */
export interface Timers {
  TOTAL: number;
  REAL: number;
  REAL_SHADER: number;
  UPTIME: number;
  BACKGROUND: number;
}

/** Contadores de frames */
export interface Frames {
  DRAW: number;
  MOVE: number;
}

/** Configuración de sonido */
export interface SoundSettings {
  volume: number;
  music_volume: number;
  game_sounds_volume: number;
}

/** Configuración de ventana */
export interface WindowSettings {
  screenmode: string;
  vsync: number;
  selected_display: number;
  display_names: string[];
  DISPLAYS: Array<{ name: string; screen_res: { w: number; h: number } }>;
}

/** Configuración gráfica */
export interface GraphicsSettings {
  texture_scaling: number;
  shadows: string;
  crt: number;
  bloom: number;
}

/** Configuración general del juego */
export interface Settings {
  COMP: { name: string; prev_name: string; submission_name: string | null; score: number };
  DEMO: { total_uptime: number; timed_CTA_shown: boolean; win_CTA_shown: boolean; quit_CTA_shown: boolean };
  ACHIEVEMENTS_EARNED: Record<string, boolean>;
  crashreports: boolean;
  colourblind_option: boolean;
  language: string;
  screenshake: boolean;
  run_stake_stickers: boolean;
  rumble: number | null;
  play_button_pos: number;
  GAMESPEED: number;
  paused: boolean;
  profile_counters: number[];
  SOUND: SoundSettings;
  WINDOW: WindowSettings;
  CUSTOM_DECK: { Collabs: Record<string, string> };
  GRAPHICS: GraphicsSettings;
  [key: string]: any;
}

/** Estados posibles del juego */
export enum GameState {
  SELECTING_HAND = 1,
  HAND_PLAYED = 2,
  DRAW_TO_HAND = 3,
  GAME_OVER = 4,
  SHOP = 5,
  PLAY_TAROT = 6,
  BLIND_SELECT = 7,
  ROUND_EVAL = 8,
  TAROT_PACK = 9,
  PLANET_PACK = 10,
  MENU = 11,
  TUTORIAL = 12,
  SPLASH = 13,
  SANDBOX = 14,
  SPECTRAL_PACK = 15,
  DEMO_CTA = 16,
  STANDARD_PACK = 17,
  BUFFOON_PACK = 18,
  NEW_ROUND = 19,
  ASYNC_WAIT = 20,
  ASYNC_OFFLINE = 21,
}

/** Etapas del juego */
export enum GameStage {
  MAIN_MENU = 1,
  RUN = 2,
  SANDBOX = 3,
  ASYNC_LIMBO = 4,
}

/** Tipos de elementos UI */
export enum UIType {
  T = 1, // texto
  B = 2, // caja (redondeada)
  C = 3, // columna
  R = 4, // fila
  O = 5, // objeto (Node)
  ROOT = 7,
  S = 8, // slider
  I = 9, // input de texto
}

/** Color representado como arreglo RGBA */
export type Color = [number, number, number, number];

/** Convierte un valor hexadecimal a Color RGBA */
export function HEX(hex: string): Color {
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const a = hex.length > 6 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
  return [r, g, b, a];
}

// ═══════════════════════════════════════════
//          FEATURE FLAGS
// ═══════════════════════════════════════════

/**
 * Feature flags que controlan características opcionales del juego.
 */
export interface FeatureFlags {
  /** Incluir botón de 'Salir' en menú principal */
  F_QUIT_BUTTON: boolean;
  /** Saltar tutorial en partida nueva */
  F_SKIP_TUTORIAL: boolean;
  /** Créditos básicos */
  F_BASIC_CREDITS: boolean;
  /** Permitir enlaces externos */
  F_EXTERNAL_LINKS: boolean;
  /** Overlay de rendimiento */
  F_ENABLE_PERF_OVERLAY: boolean;
  /** Desactivar guardado */
  F_NO_SAVING: boolean;
  /** Silenciar todo sonido */
  F_MUTE: boolean;
  /** Sonido en hilo separado */
  F_SOUND_THREAD: boolean;
  /** Configuración de video disponible */
  F_VIDEO_SETTINGS: boolean;
  /** Call to Action para demo */
  F_CTA: boolean;
  /** Info extra de depuración */
  F_VERBOSE: boolean;
  /** Puntuaciones HTTP */
  F_HTTP_SCORES: boolean;
  /** Vibración del controlador */
  F_RUMBLE: number | null;
  /** Reportes de crash */
  F_CRASH_REPORTS: boolean;
  /** Crash sin pantalla de error */
  F_NO_ERROR_HAND: boolean;
  /** Intercambiar botones A/B pips */
  F_SWAP_AB_PIPS: boolean;
  /** Intercambiar funciones A/B */
  F_SWAP_AB_BUTTONS: boolean;
  /** Intercambiar funciones X/Y */
  F_SWAP_XY_BUTTONS: boolean;
  /** Desactivar logros */
  F_NO_ACHIEVEMENTS: boolean;
  /** Nombre de usuario a mostrar */
  F_DISP_USERNAME: string | null;
  /** Solo inglés */
  F_ENGLISH_ONLY: boolean | null;
  /** Botón 'guide' */
  F_GUIDE: boolean;
  /** Mobile UI */
  F_MOBILE_UI: boolean;
  /** Temporizador de guardado en segundos */
  F_SAVE_TIMER: number;
}

// ═══════════════════════════════════════════
//           COLORES DEL JUEGO
// ═══════════════════════════════════════════

/**
 * Paleta de colores principal del juego.
 */
export const COLORS = {
  MULT: HEX('FE5F55'),
  CHIPS: HEX('009dff'),
  MONEY: HEX('f3b958'),
  XMULT: HEX('FE5F55'),
  FILTER: HEX('ff9a00'),
  BLUE: HEX('009dff'),
  RED: HEX('FE5F55'),
  GREEN: HEX('4BC292'),
  PALE_GREEN: HEX('56a887'),
  ORANGE: HEX('fda200'),
  IMPORTANT: HEX('ff9a00'),
  GOLD: HEX('eac058'),
  YELLOW: [1, 1, 0, 1] as Color,
  CLEAR: [0, 0, 0, 0] as Color,
  WHITE: [1, 1, 1, 1] as Color,
  PURPLE: HEX('8867a5'),
  BLACK: HEX('374244'),
  L_BLACK: HEX('4f6367'),
  GREY: HEX('5f7377'),
  CHANCE: HEX('4BC292'),
  JOKER_GREY: HEX('bfc7d5'),
  VOUCHER: HEX('cb724c'),
  BOOSTER: HEX('646eb7'),
  EDITION: [1, 1, 1, 1] as Color,
  DARK_EDITION: [0, 0, 0, 1] as Color,
  ETERNAL: HEX('c75985'),
  PERISHABLE: HEX('4f5da1'),
  RENTAL: HEX('b18f43'),
};

// ═══════════════════════════════════════════
//     LISTA DE MANOS DE PÓKER
// ═══════════════════════════════════════════

/**
 * Lista ordenada de manos de póker del juego (mayor a menor).
 */
export const HAND_LIST: string[] = [
  'Flush Five',
  'Flush House',
  'Five of a Kind',
  'Straight Flush',
  'Four of a Kind',
  'Full House',
  'Flush',
  'Straight',
  'Three of a Kind',
  'Two Pair',
  'Pair',
  'High Card',
];

// ═══════════════════════════════════════════
//       CONSTANTES DE RENDERIZADO
// ═══════════════════════════════════════════

/** Tamaño base de tiles en píxeles */
export const TILESIZE = 20;
/** Escala de tiles */
export const TILESCALE = 3.65;
/** Ancho del área de juego en tiles */
export const TILE_W = 21;
/** Alto del área de juego en tiles */
export const TILE_H = 11.2;
/** Ancho base de una carta */
export const CARD_W = 2.4 * 35 / 41;
/** Alto base de una carta */
export const CARD_H = 2.4 * 47 / 41;
/** Altura del resaltado de carta */
export const HIGHLIGHT_H = 0.2 * CARD_H;
/** Margen de colisión */
export const COLLISION_BUFFER = 0.05;


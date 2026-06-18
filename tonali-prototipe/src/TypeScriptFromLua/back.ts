/**
 * @file back.ts
 * @description Clase Back que representa el reverso/mazo seleccionado del juego.
 * Gestiona los efectos del mazo, la generación de UI y la aplicación de bonificaciones.
 */

//import { Color } from './globals';

/** Posición en el atlas de sprites */
export interface Position {
  x: number;
  y: number;
}

/** Configuración del efecto del mazo */
export interface BackEffectConfig {
  hands?: number;
  discards?: number;
  dollars?: number;
  extra_hand_bonus?: number;
  extra_discard_bonus?: number;
  joker_slot?: number;
  hand_size?: number;
  ante_scaling?: number;
  consumable_slot?: number;
  no_interest?: boolean;
  voucher?: string;
  vouchers?: string[];
  consumables?: string[];
  remove_faces?: boolean;
  spectral_rate?: number;
  reroll_discount?: number;
  edition?: string;
  edition_count?: number;
  randomize_rank_suit?: boolean;
  [key: string]: any;
}

/** Centro/prototipo del mazo */
export interface BackCenter {
  name: string;
  key: string;
  pos: Position;
  config: BackEffectConfig;
  unlocked: boolean;
  unlock_condition?: any;
  demo?: boolean;
  [key: string]: any;
}

/** Efecto activo del mazo */
export interface BackEffect {
  center: BackCenter;
  text_UI: string;
  config: BackEffectConfig;
}

/** Datos de guardado del mazo */
export interface BackSaveTable {
  name: string;
  pos: Position;
  effect: BackEffect;
  key: string;
}

/**
 * Clase Back: Representa un mazo (deck) seleccionado.
 * Aplica modificadores y efectos especiales según el tipo de mazo elegido.
 */
export class Back {
  /** Nombre del mazo */
  name: string;
  /** Efecto activo del mazo */
  effect: BackEffect;
  /** Nombre localizado */
  loc_name: string;
  /** Posición en el atlas de sprites */
  pos: Position;

  /**
   * Inicializa el mazo con un centro/prototipo seleccionado.
   * @param selectedBack - El prototipo del mazo; si no se provee, usa Red Deck por defecto.
   */
  constructor(selectedBack?: BackCenter) {
    const back = selectedBack || ({ name: 'Red Deck', key: 'b_red', pos: { x: 0, y: 0 }, config: {}, unlocked: true } as BackCenter);
    this.name = back.name || 'Red Deck';
    this.effect = {
      center: back,
      text_UI: '',
      config: { ...back.config },
    };
    this.loc_name = ''; // Se establecería con localize()
    const pos = (back.unlocked && back.pos) || { x: 4, y: 0 };
    this.pos = { x: pos.x, y: pos.y };
  }

  /**
   * Obtiene el nombre a mostrar (localizado o "Locked").
   * @returns Nombre del mazo o texto de bloqueado
   */
  getName(): string {
    if (this.effect.center.unlocked) {
      return this.loc_name;
    }
    return 'Locked';
  }

  /**
   * Cambia el mazo actual a uno nuevo.
   * @param newBack - Nuevo prototipo de mazo
   */
  changeTo(newBack?: BackCenter): void {
    const back = newBack || ({ name: 'Red Deck', key: 'b_red', pos: { x: 0, y: 0 }, config: {}, unlocked: true } as BackCenter);
    this.name = back.name || 'Red Deck';
    this.effect = {
      center: back,
      text_UI: '',
      config: { ...back.config },
    };
    this.loc_name = '';
    const pos = back.unlocked ? { ...back.pos } : { x: 4, y: 0 };
    this.pos = { x: pos.x, y: pos.y };
  }

  /**
   * Serializa el estado del mazo para guardado.
   * @returns Tabla de guardado del mazo
   */
  save(): BackSaveTable {
    return {
      name: this.name,
      pos: this.pos,
      effect: this.effect,
      key: this.effect.center.key || 'b_red',
    };
  }

  /**
   * Dispara el efecto especial del mazo según el contexto de juego.
   * @param args - Contexto del efecto (eval, blind_amount, final_scoring_step)
   * @returns Chips y mult modificados, o undefined
   */
  triggerEffect(args?: { context: string; chips?: number; mult?: number }): { chips: number; mult: number } | undefined {
    if (!args) return undefined;

    if (this.name === 'Plasma Deck' && args.context === 'final_scoring_step') {
      const tot = (args.chips || 0) + (args.mult || 0);
      const chips = Math.floor(tot / 2);
      const mult = Math.floor(tot / 2);
      return { chips, mult };
    }

    return undefined;
  }

  /**
   * Aplica los efectos del mazo al inicio de una partida.
   * Modifica parámetros globales del juego según la configuración.
   */
  applyToRun(): void {
    // Cada efecto del mazo modifica parámetros del juego global.
    // Esta es una versión simplificada; la implementación completa
    // requiere acceso al estado global del juego (G).
    // const config = this.effect.config;

    // Los efectos se aplicarían al objeto GAME global:
    // - config.hands: modifica manos iniciales
    // - config.discards: modifica descartes iniciales
    // - config.dollars: modifica dinero inicial
    // - config.joker_slot: modifica slots de joker
    // - config.hand_size: modifica tamaño de mano
    // - config.ante_scaling: modifica escalado de ante
    // etc.
  }

  /**
   * Carga el estado del mazo desde una tabla de guardado.
   * @param backTable - Datos guardados del mazo
   * @param centers - Registro de centros disponibles
   */
  load(backTable: BackSaveTable, centers?: Record<string, BackCenter>): void {
    this.name = backTable.name;
    this.pos = backTable.pos;
    this.effect = backTable.effect;
    if (centers) {
      this.effect.center = centers[backTable.key] || centers['b_red'];
    }
    this.loc_name = '';
  }
}


/**
 * @file blind.ts
 * @description Clase Blind que representa los blinds (enemigos/jefes) del juego.
 * Los blinds establecen la cantidad de fichas a superar y pueden aplicar efectos debuff.
 */

import { Position } from './back';

/** Información de debuff del blind */
export interface BlindDebuff {
  suit?: string;
  is_face?: string;
  hand?: string;
  h_size_ge?: number;
  h_size_le?: number;
  value?: string;
  nominal?: number;
}

/** Configuración del blind (prototipo) */
export interface BlindConfig {
  name: string;
  pos: Position;
  mult: number;
  dollars: number;
  vars?: any[];
  debuff?: BlindDebuff;
  boss?: { min: number; max: number; showdown?: boolean };
  key?: string;
  [key: string]: any;
}

/** Datos de guardado del blind */
export interface BlindSaveTable {
  name: string;
  dollars: number;
  debuff: BlindDebuff;
  pos: Position;
  mult: number;
  disabled: boolean;
  discards_sub: number | null;
  hands_sub: number | null;
  boss: boolean;
  config_blind: string;
  chips: number;
  chip_text: string;
  hands?: Record<string, boolean>;
  only_hand?: string | false;
  triggered?: boolean;
}

/**
 * Clase Blind: Representa un blind (objetivo a superar) en cada ronda.
 * Los blinds boss tienen efectos especiales que dificultan la partida.
 */
export class Blind {
  /** Nombre del blind */
  name: string;
  /** Fichas objetivo para superar el blind */
  chips: number;
  /** Texto formateado de las fichas */
  chipText: string;
  /** Si es un blind boss */
  boss: boolean;
  /** Dinero otorgado al superar el blind */
  dollars: number;
  /** Multiplicador de fichas */
  mult: number;
  /** Si el blind está deshabilitado */
  disabled: boolean;
  /** Debuff activo del blind */
  debuff: BlindDebuff;
  /** Posición en el atlas de sprites */
  pos: Position;
  /** Descartes sustraídos */
  discardsSub: number | null;
  /** Manos sustraídas */
  handsSub: number | null;
  /** Configuración del blind (prototipo) */
  config: { blind: BlindConfig };
  /** Manos ya jugadas (para The Eye) */
  hands?: Record<string, boolean>;
  /** Única mano permitida (para The Mouth) */
  onlyHand: string | false;
  /** Si se activó el efecto del blind */
  triggered?: boolean;
  /** Si el blind ha sido preparado */
  prepped?: boolean;
  /** Texto de debuff localizado */
  locDebuffText: string;
  /** Líneas de debuff localizadas */
  locDebuffLines: [string, string];
  /** Nombre localizado */
  locName: string;

  constructor() {
    this.name = '';
    this.chips = 0;
    this.chipText = '0';
    this.boss = false;
    this.dollars = 0;
    this.mult = 0;
    this.disabled = false;
    this.debuff = {};
    this.pos = { x: 0, y: 0 };
    this.discardsSub = null;
    this.handsSub = null;
    this.config = { blind: { name: '', pos: { x: 0, y: 0 }, mult: 0, dollars: 0 } };
    this.onlyHand = false;
    this.locDebuffText = '';
    this.locDebuffLines = ['', ''];
    this.locName = '';
  }

  /**
   * Establece el blind activo con un prototipo dado.
   * @param blind - Prototipo del blind a activar
   * @param reset - Si es un reset (no aplicar efectos especiales)
   * @param silent - Si no reproducir sonidos
   */
  setBlind(blind: BlindConfig | null, reset?: boolean, silent?: boolean): void {
    if (!reset) {
      this.config.blind = blind || { name: '', pos: { x: 0, y: 0 }, mult: 0, dollars: 0 };
      this.name = blind?.name || '';
      this.dollars = blind?.dollars || 0;
      this.debuff = blind?.debuff || {};
      this.pos = blind?.pos || { x: 0, y: 0 };
      this.mult = blind?.mult || 0;
      this.disabled = false;
      this.boss = !!(blind?.boss);
      this.triggered = undefined;
      this.prepped = true;
    }

    // Configuración especial según el tipo de blind
    if (this.name === 'The Eye' && !reset) {
      this.hands = {
        'Flush Five': false, 'Flush House': false, 'Five of a Kind': false,
        'Straight Flush': false, 'Four of a Kind': false, 'Full House': false,
        'Flush': false, 'Straight': false, 'Three of a Kind': false,
        'Two Pair': false, 'Pair': false, 'High Card': false,
      };
    }
    if (this.name === 'The Mouth' && !reset) {
      this.onlyHand = false;
    }
    if (this.name === 'The Fish' && !reset) {
      this.prepped = undefined;
    }
  }

  /**
   * Obtiene el tipo del blind actual.
   * @returns 'Small', 'Big' o 'Boss'
   */
  getType(): 'Small' | 'Big' | 'Boss' | undefined {
    if (this.name === 'Small Blind') return 'Small';
    if (this.name === 'Big Blind') return 'Big';
    if (this.name && this.name !== '') return 'Boss';
    return undefined;
  }

  /**
   * Desactiva el blind boss actual, removiendo su efecto.
   */
  disable(): void {
    this.disabled = true;
  }

  /**
   * Modifica la mano jugada según las reglas del blind.
   * @param cards - Cartas jugadas
   * @param pokerHands - Manos de póker detectadas
   * @param text - Nombre de la mano
   * @param mult - Multiplicador actual
   * @param handChips - Fichas de la mano actual
   * @returns Mult y chips modificados, y si hubo modificación
   */
  modifyHand(
    cards: any[],
    pokerHands: any,
    text: string,
    mult: number,
    handChips: number
  ): { mult: number; handChips: number; modified: boolean } {
    if (this.disabled) return { mult, handChips, modified: false };

    if (this.name === 'The Flint') {
      this.triggered = true;
      return {
        mult: Math.max(Math.floor(mult * 0.5 + 0.5), 1),
        handChips: Math.max(Math.floor(handChips * 0.5 + 0.5), 0),
        modified: true,
      };
    }
    return { mult, handChips, modified: false };
  }

  /**
   * Verifica si una mano debe ser debuffeada por el blind.
   * @param cards - Cartas de la mano
   * @param hand - Manos de póker detectadas
   * @param handname - Nombre de la mano jugada
   * @param check - Si es solo una verificación (sin aplicar efecto)
   * @returns true si la mano está debuffeada
   */
  debuffHand(cards: any[], hand: any, handname: string, check?: boolean): boolean {
    if (this.disabled) return false;

    if (this.debuff) {
      if (this.debuff.hand && hand[this.debuff.hand]?.length > 0) {
        this.triggered = true;
        return true;
      }
      if (this.debuff.h_size_ge && cards.length < this.debuff.h_size_ge) {
        this.triggered = true;
        return true;
      }
      if (this.debuff.h_size_le && cards.length > this.debuff.h_size_le) {
        this.triggered = true;
        return true;
      }
      if (this.name === 'The Eye' && this.hands) {
        if (this.hands[handname]) {
          this.triggered = true;
          return true;
        }
        if (!check) this.hands[handname] = true;
      }
      if (this.name === 'The Mouth') {
        if (this.onlyHand && this.onlyHand !== handname) {
          this.triggered = true;
          return true;
        }
        if (!check) this.onlyHand = handname;
      }
    }
    return false;
  }

  /**
   * Aplica debuff a una carta según las reglas del blind.
   * @param card - Carta a verificar
   * @param fromBlind - Si viene de un blind (para jokers)
   */
  debuffCard(card: any, fromBlind?: boolean): void {
    // Implementación simplificada
    if (this.debuff && !this.disabled && card.area !== 'jokers') {
      if (this.debuff.suit && card.suit === this.debuff.suit) {
        card.debuffed = true;
        return;
      }
      if (this.debuff.is_face === 'face' && card.isFace) {
        card.debuffed = true;
        return;
      }
    }
    card.debuffed = false;
  }

  /**
   * Serializa el blind para guardado.
   * @returns Datos de guardado del blind
   */
  save(): BlindSaveTable {
    return {
      name: this.name,
      dollars: this.dollars,
      debuff: this.debuff,
      pos: this.pos,
      mult: this.mult,
      disabled: this.disabled,
      discards_sub: this.discardsSub,
      hands_sub: this.handsSub,
      boss: this.boss,
      config_blind: this.config.blind.key || '',
      chips: this.chips,
      chip_text: this.chipText,
      hands: this.hands,
      only_hand: this.onlyHand,
      triggered: this.triggered,
    };
  }

  /**
   * Carga el blind desde datos guardados.
   * @param table - Datos de guardado
   */
  load(table: BlindSaveTable): void {
    this.name = table.name;
    this.dollars = table.dollars;
    this.debuff = table.debuff;
    this.pos = table.pos;
    this.mult = table.mult;
    this.disabled = table.disabled;
    this.discardsSub = table.discards_sub;
    this.handsSub = table.hands_sub;
    this.boss = table.boss;
    this.chips = table.chips;
    this.chipText = table.chip_text;
    this.hands = table.hands;
    this.onlyHand = table.only_hand || false;
    this.triggered = table.triggered;
  }
}


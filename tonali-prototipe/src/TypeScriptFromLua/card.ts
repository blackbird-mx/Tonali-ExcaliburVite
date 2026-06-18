/**
 * @file card.ts
 * @description Clase Card que representa todas las cartas del juego (jugables, jokers, consumibles, vouchers, boosters).
 * Gestiona habilidades, ediciones, sellos, costos y efectos de cada carta.
 */

import { Position } from './back';

/** Edición de una carta */
export interface CardEdition {
  type: 'foil' | 'holo' | 'polychrome' | 'negative';
  foil?: boolean;
  holo?: boolean;
  polychrome?: boolean;
  negative?: boolean;
  chips?: number;
  mult?: number;
  x_mult?: number;
}

/** Tipo de sello de carta */
export type SealType = 'Gold' | 'Red' | 'Blue' | 'Purple' | null;

/** Base de una carta de juego */
export interface CardBase {
  name: string;
  suit: string;
  value: string;
  nominal: number;
  suit_nominal: number;
  suit_nominal_original?: number;
  face_nominal: number;
  id: number;
  colour?: any;
  times_played: number;
  original_value?: string;
}

/** Habilidad/efecto de una carta */
export interface CardAbility {
  name: string;
  effect?: string;
  set: string;
  mult: number;
  h_mult: number;
  h_x_mult: number;
  h_dollars: number;
  p_dollars: number;
  t_mult: number;
  t_chips: number;
  x_mult: number;
  h_size: number;
  d_size: number;
  extra?: any;
  extra_value: number;
  type: string;
  order?: number;
  forced_selection?: boolean;
  perma_bonus: number;
  bonus: number;
  consumeable?: any;
  eternal?: boolean;
  perishable?: boolean;
  perish_tally?: number;
  rental?: boolean;
  [key: string]: any;
}

/** Configuración del centro de la carta */
export interface CardCenter {
  name: string;
  pos: Position;
  set: string;
  effect?: string;
  config: Record<string, any>;
  cost?: number;
  order?: number;
  rarity?: number;
  discovered?: boolean;
  unlocked?: boolean;
  key?: string;
  consumeable?: boolean;
  blueprint_compat?: boolean;
  perishable_compat?: boolean;
  eternal_compat?: boolean;
  [key: string]: any;
}

/**
 * Clase Card: Representa cualquier carta del juego.
 * Las cartas pueden ser naipes estándar, jokers, tarots, planetas, spectrals, vouchers o boosters.
 */
export class Card {
  /** Posición X */
  x: number;
  /** Posición Y */
  y: number;
  /** Ancho */
  w: number;
  /** Alto */
  h: number;
  /** ID de ordenamiento */
  sortId: number;
  /** Configuración del centro/prototipo */
  config: { center: CardCenter; card: any; center_key?: string; card_key?: string };
  /** Base de la carta (suit, valor, nominal) */
  base: CardBase;
  /** Habilidad activa de la carta */
  ability: CardAbility;
  /** Edición de la carta */
  edition: CardEdition | null;
  /** Sello de la carta */
  seal: SealType;
  /** Si la carta está debuffeada */
  debuff: boolean;
  /** Si la carta está cara arriba o cara abajo */
  facing: 'front' | 'back';
  /** Si la carta está resaltada */
  highlighted: boolean;
  /** Costo base de la carta */
  baseCost: number;
  /** Costo extra (edición, inflación) */
  extraCost: number;
  /** Costo total */
  cost: number;
  /** Precio de venta */
  sellCost: number;
  /** Si la carta es una carta jugable (del mazo) */
  playingCard?: boolean;
  /** Si la carta fue añadida al mazo activo */
  addedToDeck: boolean;
  /** Rango (posición) en el área */
  rank: number | null;
  /** Área donde se encuentra la carta */
  area: any;

  /** Contador global de IDs */
  private static nextSortId = 0;

  /**
   * Crea una nueva carta.
   * @param x - Posición X inicial
   * @param y - Posición Y inicial
   * @param w - Ancho de la carta
   * @param h - Alto de la carta
   * @param cardData - Datos de la carta base (suit, value)
   * @param center - Centro/prototipo que define el tipo de carta
   * @param params - Parámetros adicionales
   */
  constructor(
    x: number,
    y: number,
    w: number,
    h: number,
    cardData?: any,
    center?: CardCenter,
    params?: Record<string, any>
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sortId = Card.nextSortId++;
    this.config = {
      center: center || { name: 'Default Base', pos: { x: 0, y: 0 }, set: 'Default', config: {} },
      card: cardData || {},
    };
    this.base = {
      name: '',
      suit: '',
      value: '',
      nominal: 0,
      suit_nominal: 0,
      face_nominal: 0,
      id: 0,
      times_played: 0,
    };
    this.ability = {
      name: center?.name || '',
      set: center?.set || 'Default',
      mult: 0,
      h_mult: 0,
      h_x_mult: 0,
      h_dollars: 0,
      p_dollars: 0,
      t_mult: 0,
      t_chips: 0,
      x_mult: 1,
      h_size: 0,
      d_size: 0,
      extra_value: 0,
      type: '',
      perma_bonus: 0,
      bonus: 0,
    };
    this.edition = null;
    this.seal = null;
    this.debuff = false;
    this.facing = 'front';
    this.highlighted = false;
    this.baseCost = center?.cost || 1;
    this.extraCost = 0;
    this.cost = this.baseCost;
    this.sellCost = Math.max(1, Math.floor(this.cost / 2));
    this.playingCard = params?.playing_card;
    this.addedToDeck = false;
    this.rank = null;
    this.area = null;

    if (center) {
      this.setAbility(center, true);
    }
    if (cardData) {
      this.setBase(cardData, true);
    }
  }

  /**
   * Establece la habilidad/efecto de la carta basándose en un centro.
   * @param center - Centro/prototipo a aplicar
   * @param initial - Si es la configuración inicial
   */
  setAbility(center: CardCenter, initial?: boolean): void {
    this.config.center = center;
    this.ability = {
      name: center.name,
      effect: center.effect,
      set: center.set,
      mult: center.config.mult || 0,
      h_mult: center.config.h_mult || 0,
      h_x_mult: center.config.h_x_mult || 0,
      h_dollars: center.config.h_dollars || 0,
      p_dollars: center.config.p_dollars || 0,
      t_mult: center.config.t_mult || 0,
      t_chips: center.config.t_chips || 0,
      x_mult: center.config.Xmult || 1,
      h_size: center.config.h_size || 0,
      d_size: center.config.d_size || 0,
      extra: center.config.extra ? JSON.parse(JSON.stringify(center.config.extra)) : undefined,
      extra_value: 0,
      type: center.config.type || '',
      order: center.order,
      perma_bonus: this.ability?.perma_bonus || 0,
      bonus: (center.config.bonus || 0),
    };
    this.baseCost = center.cost || 1;
  }

  /**
   * Establece la base de la carta (palo, valor, nominal).
   * @param cardData - Datos de la carta base
   * @param initial - Si es la configuración inicial
   */
  setBase(cardData: any, initial?: boolean): void {
    this.config.card = cardData;
    this.base = {
      name: cardData.name || '',
      suit: cardData.suit || '',
      value: cardData.value || '',
      nominal: 0,
      suit_nominal: 0,
      face_nominal: 0,
      id: 0,
      times_played: 0,
    };

    // Asignar nominal según valor
    const valueMap: Record<string, { nominal: number; id: number; face_nominal?: number }> = {
      '2': { nominal: 2, id: 2 }, '3': { nominal: 3, id: 3 }, '4': { nominal: 4, id: 4 },
      '5': { nominal: 5, id: 5 }, '6': { nominal: 6, id: 6 }, '7': { nominal: 7, id: 7 },
      '8': { nominal: 8, id: 8 }, '9': { nominal: 9, id: 9 }, '10': { nominal: 10, id: 10 },
      'Jack': { nominal: 10, id: 11, face_nominal: 0.1 },
      'Queen': { nominal: 10, id: 12, face_nominal: 0.2 },
      'King': { nominal: 10, id: 13, face_nominal: 0.3 },
      'Ace': { nominal: 11, id: 14, face_nominal: 0.4 },
    };

    const vm = valueMap[this.base.value];
    if (vm) {
      this.base.nominal = vm.nominal;
      this.base.id = vm.id;
      this.base.face_nominal = vm.face_nominal || 0;
    }

    // Asignar suit_nominal
    const suitMap: Record<string, number> = {
      'Diamonds': 0.01, 'Clubs': 0.02, 'Hearts': 0.03, 'Spades': 0.04,
    };
    this.base.suit_nominal = suitMap[this.base.suit] || 0;

    if (initial) {
      this.base.original_value = this.base.value;
    }
  }

  /**
   * Establece la edición de la carta.
   * @param edition - Tipo de edición a aplicar, o null para remover
   * @param immediate - Sin animación
   * @param silent - Sin sonido
   */
  setEdition(edition: Partial<CardEdition> | null, immediate?: boolean, silent?: boolean): void {
    this.edition = null;
    if (!edition) return;

    if (edition.foil) {
      this.edition = { type: 'foil', foil: true, chips: 50 };
    } else if (edition.holo) {
      this.edition = { type: 'holo', holo: true, mult: 10 };
    } else if (edition.polychrome) {
      this.edition = { type: 'polychrome', polychrome: true, x_mult: 1.5 };
    } else if (edition.negative) {
      this.edition = { type: 'negative', negative: true };
    }
    this.setCost();
  }

  /**
   * Establece el sello de la carta.
   * @param seal - Tipo de sello o null para remover
   * @param silent - Sin sonido
   * @param immediate - Sin animación
   */
  setSeal(seal: SealType, silent?: boolean, immediate?: boolean): void {
    this.seal = seal;
    this.setCost();
  }

  /**
   * Obtiene el sello de la carta (null si está debuffeada).
   * @param bypassDebuff - Ignorar debuff
   */
  getSeal(bypassDebuff?: boolean): SealType {
    if (this.debuff && !bypassDebuff) return null;
    return this.seal;
  }

  /**
   * Recalcula el costo de la carta basándose en base, edición y descuentos.
   */
  setCost(): void {
    this.extraCost = 0;
    if (this.edition) {
      this.extraCost += (this.edition.holo ? 3 : 0) + (this.edition.foil ? 2 : 0)
        + (this.edition.polychrome ? 5 : 0) + (this.edition.negative ? 5 : 0);
    }
    this.cost = Math.max(1, Math.floor((this.baseCost + this.extraCost + 0.5)));
    this.sellCost = Math.max(1, Math.floor(this.cost / 2)) + (this.ability.extra_value || 0);
  }

  /**
   * Obtiene el valor nominal para ordenamiento.
   * @param mod - Tipo de modificador ('suit' para ordenar por palo)
   */
  getNominal(mod?: string): number {
    let mult = 1;
    if (mod === 'suit') mult = 1000;
    if (this.ability.effect === 'Stone Card') mult = -1000;
    return this.base.nominal + this.base.suit_nominal * mult + this.base.face_nominal;
  }

  /**
   * Obtiene el ID de la carta (para manos de póker).
   */
  getId(): number {
    if (this.ability.effect === 'Stone Card') {
      return -(Math.random() * 1000000);
    }
    return this.base.id;
  }

  /**
   * Verifica si la carta es una carta de cara (J, Q, K).
   * @param fromBoss - Si la consulta viene de un boss blind
   */
  isFace(fromBoss?: boolean): boolean {
    if (this.debuff && !fromBoss) return false;
    const id = this.getId();
    return id === 11 || id === 12 || id === 13;
  }

  /**
   * Obtiene las fichas de bonus de la carta.
   */
  getChipBonus(): number {
    if (this.debuff) return 0;
    if (this.ability.effect === 'Stone Card') {
      return this.ability.bonus + this.ability.perma_bonus;
    }
    return this.base.nominal + this.ability.bonus + this.ability.perma_bonus;
  }

  /**
   * Obtiene el multiplicador de la carta.
   */
  getChipMult(): number {
    if (this.debuff) return 0;
    if (this.ability.set === 'Joker') return 0;
    return this.ability.mult;
  }

  /**
   * Obtiene el multiplicador X de la carta.
   */
  getChipXMult(): number {
    if (this.debuff) return 0;
    if (this.ability.set === 'Joker') return 0;
    if (this.ability.x_mult <= 1) return 0;
    return this.ability.x_mult;
  }

  /**
   * Voltea la carta entre frente y reverso.
   */
  flip(): void {
    this.facing = this.facing === 'front' ? 'back' : 'front';
  }

  /**
   * Resalta/des-resalta la carta.
   * @param state - true para resaltar, false para quitar
   */
  highlight(state: boolean): void {
    this.highlighted = state;
  }

  /**
   * Cambia el palo de la carta.
   * @param newSuit - Nuevo palo ('Diamonds', 'Spades', 'Clubs', 'Hearts')
   */
  changeSuit(newSuit: string): void {
    const codeMap: Record<string, string> = {
      'Diamonds': 'D_', 'Spades': 'S_', 'Clubs': 'C_', 'Hearts': 'H_',
    };
    const code = codeMap[newSuit] || 'H_';

    console.log(code);

    // Se reconstruiría la carta con el nuevo palo
    this.base.suit = newSuit;
  }

  /**
   * Establece si la carta está debuffeada.
   * @param shouldDebuff - true para debuffear, false para quitar debuff
   */
  setDebuff(shouldDebuff: boolean): void {
    this.debuff = shouldDebuff;
  }
}


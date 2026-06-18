/**
 * @file tag.ts
 * @description Clase Tag que representa etiquetas/bonificaciones obtenidas al saltarse blinds.
 * Cada tag tiene un tipo de efecto que se activa en un momento específico del juego.
 */

import { Position } from './back';

/** Configuración de un prototipo de tag */
export interface TagConfig {
  type: string;
  dollars?: number;
  dollars_per_hand?: number;
  dollars_per_discard?: number;
  h_size?: number;
  spawn_jokers?: number;
  skip_bonus?: number;
  levels?: number;
  max?: number;
  [key: string]: any;
}

/** Prototipo de tag definido en P_TAGS */
export interface TagPrototype {
  name: string;
  set: string;
  discovered: boolean;
  min_ante?: number | null;
  order: number;
  config: TagConfig;
  pos: Position;
  key?: string;
}

/** Habilidad del tag */
export interface TagAbility {
  orbital_hand: string;
  blind_type?: string;
}

/** Datos de guardado del tag */
export interface TagSaveTable {
  key: string;
  tally: number;
  ability: TagAbility;
}

/**
 * Clase Tag: Representa una etiqueta/bonificación que se obtiene
 * al saltarse blinds o por otros eventos del juego.
 */
export class Tag {
  /** Clave identificadora del tag */
  key: string;
  /** Configuración copiada del prototipo */
  config: TagConfig;
  /** Posición en el atlas de sprites */
  pos: Position;
  /** Nombre del tag */
  name: string;
  /** Conteo/tally del tag */
  tally: number;
  /** Si el tag ya fue activado */
  triggered: boolean;
  /** ID único del tag */
  ID: number;
  /** Habilidad especial del tag */
  ability: TagAbility;

  /** Contador global de IDs de tags */
  private static nextId = 0;

  /**
   * Crea una instancia de Tag.
   * @param tagKey - Clave del tag en P_TAGS
   * @param forCollection - Si es solo para mostrar en la colección
   * @param blindType - Tipo de blind asociado
   */
  constructor(tagKey: string, forCollection = false, blindType?: string) {
    this.key = tagKey;
    // En la implementación real, se buscaría en G.P_TAGS
    this.config = { type: '' };
    this.pos = { x: 0, y: 0 };
    this.name = '';
    this.tally = 0;
    this.triggered = false;
    this.ID = Tag.nextId++;
    this.ability = {
      orbital_hand: '[Poker Hand]',
      blind_type: blindType,
    };

    if (!forCollection) {
      this.setAbility();
    }
  }

  /**
   * Configura la habilidad especial según el tipo de tag.
   * Para Orbital Tag, asigna la mano de póker correspondiente.
   */
  setAbility(): void {
    if (this.name === 'Orbital Tag') {
      // En la implementación real se buscaría en G.orbital_hand o G.GAME.orbital_choices
    }
  }

  /**
   * Aplica el efecto del tag al contexto de juego actual.
   * @param context - Contexto de aplicación (eval, immediate, new_blind_choice, etc.)
   * @returns true si el tag fue activado, o datos del efecto
   */
  applyToRun(context: { type: string; [key: string]: any }): any {
    if (this.triggered || this.config.type !== context.type) return undefined;

    switch (context.type) {
      case 'eval':
        if (this.name === 'Investment Tag') {
          this.triggered = true;
          return { dollars: this.config.dollars, tag: this };
        }
        break;

      case 'immediate':
        if (this.name === 'Top-up Tag') {
          this.triggered = true;
          return true;
        }
        if (this.name === 'Skip Tag') {
          this.triggered = true;
          return true;
        }
        if (this.name === 'Garbage Tag') {
          this.triggered = true;
          return true;
        }
        if (this.name === 'Handy Tag') {
          this.triggered = true;
          return true;
        }
        if (this.name === 'Economy Tag') {
          this.triggered = true;
          return true;
        }
        if (this.name === 'Orbital Tag') {
          this.triggered = true;
          return true;
        }
        break;

      case 'new_blind_choice':
        if (['Charm Tag', 'Meteor Tag', 'Ethereal Tag', 'Standard Tag', 'Buffoon Tag', 'Boss Tag'].includes(this.name)) {
          this.triggered = true;
          return true;
        }
        break;

      case 'voucher_add':
        if (this.name === 'Voucher Tag') {
          this.triggered = true;
          return true;
        }
        break;

      case 'tag_add':
        if (this.name === 'Double Tag') {
          this.triggered = true;
          return true;
        }
        break;

      case 'round_start_bonus':
        if (this.name === 'Juggle Tag') {
          this.triggered = true;
          return true;
        }
        break;

      case 'store_joker_create':
        if (this.name === 'Rare Tag' || this.name === 'Uncommon Tag') {
          this.triggered = true;
          return null; // Se retornaría la carta creada
        }
        break;

      case 'shop_start':
        if (this.name === 'D6 Tag') {
          this.triggered = true;
          return true;
        }
        break;

      case 'store_joker_modify':
        if (['Foil Tag', 'Holographic Tag', 'Polychrome Tag', 'Negative Tag'].includes(this.name)) {
          this.triggered = true;
          return true;
        }
        break;

      case 'shop_final_pass':
        if (this.name === 'Coupon Tag') {
          this.triggered = true;
          return true;
        }
        break;
    }

    return undefined;
  }

  /**
   * Serializa el tag para guardado.
   * @returns Datos de guardado del tag
   */
  save(): TagSaveTable {
    return {
      key: this.key,
      tally: this.tally,
      ability: this.ability,
    };
  }

  /**
   * Carga el estado del tag desde datos guardados.
   * @param saveTable - Datos de guardado
   */
  load(saveTable: TagSaveTable): void {
    this.key = saveTable.key;
    this.tally = saveTable.tally;
    this.ability = saveTable.ability;
  }

  /**
   * Anima un efecto de "juice" en el sprite del tag.
   * @param scale - Escala de la animación
   * @param rot - Rotación de la animación
   */
  juiceUp(scale?: number, rot?: number): void {
    // Implementación de animación visual
  }

  /**
   * Elimina el tag del juego y del HUD.
   */
  remove(): void {
    // Implementación de eliminación del juego
  }
}


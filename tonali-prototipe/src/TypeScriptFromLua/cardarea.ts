/**
 * @file cardarea.ts
 * @description Clase CardArea que representa un área contenedora de cartas (mano, mazo, descarte, jokers, tienda, etc.).
 * Gestiona la disposición, ordenamiento, resaltado y animación de las cartas dentro del área.
 */

import { Card } from './card';

/** Tipos de área de cartas disponibles */
export type CardAreaType = 'deck' | 'hand' | 'play' | 'discard' | 'joker' | 'consumeable' | 'shop' | 'title' | 'title_2' | 'voucher';

/** Métodos de ordenamiento de cartas */
export type SortMethod = 'desc' | 'asc' | 'suit desc' | 'suit asc' | 'order';

/** Configuración de un CardArea */
export interface CardAreaConfig {
  /** Tipo de área */
  type: CardAreaType;
  /** Método de ordenamiento por defecto */
  sort?: SortMethod;
  /** Ancho individual de carta */
  card_w?: number;
  /** Límite máximo de cartas en el área */
  card_limit?: number;
  /** Límite de cartas resaltadas */
  highlight_limit?: number;
  /** Si el área pertenece a una colección */
  collection?: boolean;
  /** Padding izquierdo/derecho */
  lr_padding?: number;
  /** Si el área muestra cartas planas (sin rotación) */
  flat?: boolean;
  /** Si el área está dispersa (spread) */
  spread?: boolean;
  /** Layers de dibujo */
  draw_layers?: string[];
  /** Thin draw: dibuja cada N-ésima carta en mazos grandes */
  thin_draw?: number;
  /** Altura visual del mazo */
  deck_height?: number;
  /** Límite real de cartas (puede diferir de card_limit tras cambios de tamaño) */
  real_card_limit?: number;
  /** Límite temporal actual */
  temp_limit?: number;
  /** Conteo actual de cartas */
  card_count?: number;
  [key: string]: any;
}

/**
 * Clase CardArea: Contenedor visual y lógico de cartas.
 * Maneja el posicionamiento, animación, resaltado y lógica de interacción para grupos de cartas.
 */
export class CardArea {
  /** Posición X del área */
  x: number;
  /** Posición Y del área */
  y: number;
  /** Ancho del área */
  w: number;
  /** Alto del área */
  h: number;
  /** Configuración del área */
  config: CardAreaConfig;
  /** Cartas contenidas en el área */
  cards: Card[];
  /** Cartas actualmente resaltadas */
  highlighted: Card[];
  /** Ancho de una carta individual en el área */
  cardW: number;
  /** Cantidad de shuffle (animación) */
  shuffleAmt: number;

  /**
   * Crea un nuevo CardArea.
   * @param x - Posición X
   * @param y - Posición Y
   * @param w - Ancho del área
   * @param h - Alto del área
   * @param config - Configuración del área
   */
  constructor(x: number, y: number, w: number, h: number, config?: Partial<CardAreaConfig>) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.config = {
      type: config?.type || 'deck',
      sort: config?.sort || 'desc',
      card_w: config?.card_w,
      card_limit: config?.card_limit || 52,
      highlight_limit: config?.highlight_limit || 5,
      lr_padding: config?.lr_padding || 0.1,
      temp_limit: config?.card_limit || 52,
      card_count: 0,
      ...config,
    };
    this.cards = [];
    this.highlighted = [];
    this.cardW = this.config.card_w || 0;
    this.shuffleAmt = 0;
  }

  /**
   * Coloca una carta dentro del área.
   * @param card - Carta a colocar
   * @param location - 'front' para insertarla al inicio
   * @param stayFlipped - Mantener la carta volteada
   */
  emplace(card: Card, location?: 'front' | null, stayFlipped?: boolean): void {
    if (location === 'front' || this.config.type === 'deck') {
      this.cards.unshift(card);
    } else {
      this.cards.push(card);
    }

    // Si la carta está bocabajo y el área no es descarte/mazo, voltear
    if (card.facing === 'back' && this.config.type !== 'discard' && this.config.type !== 'deck' && !stayFlipped) {
      card.flip();
    }

    // Actualizar límite si se excede (para el mazo)
    if (this.cards.length > (this.config.card_limit || 52) && this.config.type === 'deck') {
      this.config.card_limit = this.cards.length;
    }

    card.area = this;
    this.setRanks();
    this.alignCards();
  }

  /**
   * Remueve una carta del área.
   * @param card - Carta específica a remover (o null para la primera/última)
   * @param discardedOnly - Solo cartas que fueron descartadas
   * @returns La carta removida
   */
  removeCard(card?: Card | null, discardedOnly?: boolean): Card | null {
    if (!this.cards.length) return null;

    let targetCards = this.cards;
    if (discardedOnly) {
      targetCards = this.cards.filter(c => c.ability?.discarded);
    }

    const target = card || (this.config.type === 'discard' || this.config.type === 'deck'
      ? targetCards[targetCards.length - 1]
      : targetCards[0]);

    if (!target) return null;

    const idx = this.cards.indexOf(target);
    if (idx !== -1) {
      this.cards.splice(idx, 1);
      this.removeFromHighlighted(target, true);
      target.area = null;
    }

    this.setRanks();
    return target;
  }

  /**
   * Cambia el tamaño (límite de cartas) del área.
   * @param delta - Cambio en el número máximo de cartas
   */
  changeSize(delta: number): void {
    if (delta === 0) return;
    this.config.real_card_limit = (this.config.real_card_limit ?? (this.config.card_limit || 52)) + delta;
    this.config.card_limit = Math.max(0, this.config.real_card_limit);
  }

  /**
   * Verifica si se puede resaltar una carta en esta área.
   * @param card - Carta a resaltar
   * @returns true si se puede resaltar
   */
  canHighlight(card: Card): boolean {
    return this.config.type === 'hand' || this.config.type === 'joker'
      || this.config.type === 'consumeable'
      || (this.config.type === 'shop' && (this.config.highlight_limit || 0) > 0);
  }

  /**
   * Agrega una carta al grupo de resaltadas.
   * @param card - Carta a resaltar
   * @param silent - Sin sonido
   */
  addToHighlighted(card: Card, silent?: boolean): void {
    if (this.config.type === 'shop') {
      if (this.highlighted.length > 0) {
        this.removeFromHighlighted(this.highlighted[0]);
      }
      this.highlighted.push(card);
      card.highlight(true);
    } else if (this.config.type === 'joker' || this.config.type === 'consumeable') {
      if (this.highlighted.length >= (this.config.highlight_limit || 5)) {
        this.removeFromHighlighted(this.highlighted[0]);
      }
      this.highlighted.push(card);
      card.highlight(true);
    } else {
      if (this.highlighted.length >= (this.config.highlight_limit || 5)) {
        card.highlight(false);
      } else {
        this.highlighted.push(card);
        card.highlight(true);
      }
    }
  }

  /**
   * Remueve una carta del grupo de resaltadas.
   * @param card - Carta a des-resaltar
   * @param force - Forzar remoción aunque sea selección forzada
   */
  removeFromHighlighted(card: Card, force?: boolean): void {
    if (!force && card.ability?.forced_selection) return;
    const idx = this.highlighted.indexOf(card);
    if (idx !== -1) {
      this.highlighted.splice(idx, 1);
    }
    card.highlight(false);
  }

  /**
   * Des-resalta todas las cartas del área.
   */
  unhighlightAll(): void {
    for (let i = this.highlighted.length - 1; i >= 0; i--) {
      if (this.highlighted[i].ability?.forced_selection) continue;
      this.highlighted[i].highlight(false);
      this.highlighted.splice(i, 1);
    }
  }

  /**
   * Establece los rangos (posiciones numéricas) de las cartas.
   */
  setRanks(): void {
    this.cards.forEach((card, idx) => {
      card.rank = idx + 1;
    });
  }

  /**
   * Alinea visualmente las cartas según el tipo de área.
   * Calcula posición, rotación y offset para cada carta.
   */
  alignCards(): void {
    // Implementación simplificada; la versión completa usa fórmulas
    // trigonométricas para curvar la mano, apilar el mazo, etc.
    const maxCards = Math.max(this.cards.length, this.config.temp_limit || this.cards.length);

    this.cards.forEach((card, k) => {
      if (this.config.type === 'hand' || this.config.type === 'play' || this.config.type === 'shop') {
        const spacing = this.cards.length > 1
          ? (this.w - this.cardW) * (k / Math.max(maxCards - 1, 1))
          : (this.w - this.cardW) / 2;
        card.x = this.x + spacing;
        card.y = this.y + this.h / 2 - card.h / 2 - (card.highlighted ? 0.2 * card.h : 0);
      }
    });
  }

  /**
   * Baraja las cartas del área aleatoriamente.
   * @param seed - Semilla para el RNG
   */
  shuffle(seed?: string): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.setRanks();
  }

  /**
   * Ordena las cartas según el método especificado.
   * @param method - Método de ordenamiento
   */
  sort(method?: SortMethod): void {
    const m = method || this.config.sort || 'desc';
    this.config.sort = m;

    switch (m) {
      case 'desc':
        this.cards.sort((a, b) => b.getNominal() - a.getNominal());
        break;
      case 'asc':
        this.cards.sort((a, b) => a.getNominal() - b.getNominal());
        break;
      case 'suit desc':
        this.cards.sort((a, b) => b.getNominal('suit') - a.getNominal('suit'));
        break;
      case 'suit asc':
        this.cards.sort((a, b) => a.getNominal('suit') - b.getNominal('suit'));
        break;
      case 'order':
        this.cards.sort((a, b) => (a.ability.order || 0) - (b.ability.order || 0));
        break;
    }
  }

  /**
   * Serializa el área para guardado.
   * @returns Datos de guardado del área
   */
  save(): { cards: any[]; config: CardAreaConfig } {
    return {
      cards: this.cards.map(c => ({ /* datos serializados de carta */ })),
      config: this.config,
    };
  }

  /**
   * Elimina todas las cartas y limpia el área.
   */
  remove(): void {
    this.cards = [];
    this.highlighted = [];
  }
}


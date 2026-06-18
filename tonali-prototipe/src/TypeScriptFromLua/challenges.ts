/**
 * @file challenges.ts
 * @description Definición de todos los desafíos (challenges) disponibles en el juego.
 * Cada desafío tiene reglas personalizadas, jokers iniciales, vales, restricciones y mazo.
 */

/** Regla personalizada de un desafío */
export interface CustomRule {
  id: string;
  value?: string | number;
}

/** Modificador numérico de un desafío */
export interface Modifier {
  id: string;
  value: number;
}

/** Joker inicial de un desafío */
export interface ChallengeJoker {
  id: string;
  edition?: string;
  eternal?: boolean;
  pinned?: boolean;
}

/** Carta del mazo del desafío */
export interface DeckCard {
  s: string;
  r: string;
  e?: string;
  g?: string;
}

/** Elemento baneado */
export interface BannedItem {
  id: string;
  ids?: string[];
  type?: string;
}

/** Configuración del mazo del desafío */
export interface ChallengeDeck {
  type: string;
  cards?: DeckCard[];
  enhancement?: string;
  edition?: string;
}

/** Restricciones del desafío */
export interface ChallengeRestrictions {
  banned_cards: BannedItem[];
  banned_tags: BannedItem[];
  banned_other: BannedItem[];
}

/** Estructura completa de un desafío */
export interface Challenge {
  /** Nombre visible del desafío */
  name: string;
  /** Identificador único del desafío */
  id: string;
  /** Reglas del desafío */
  rules: {
    custom: CustomRule[];
    modifiers: Modifier[];
  };
  /** Jokers iniciales */
  jokers: ChallengeJoker[];
  /** Consumibles iniciales */
  consumeables: Array<{ id: string }>;
  /** Vales iniciales */
  vouchers: Array<{ id: string }>;
  /** Configuración del mazo */
  deck: ChallengeDeck;
  /** Restricciones de cartas/tags/otros */
  restrictions: ChallengeRestrictions;
}

/**
 * Lista de todos los desafíos disponibles en el juego.
 */
export const CHALLENGES: Challenge[] = [
  {
    name: 'The Omelette',
    id: 'c_omelette_1',
    rules: {
      custom: [
        { id: 'no_reward' },
        { id: 'no_extra_hand_money' },
        { id: 'no_interest' },
      ],
      modifiers: [],
    },
    jokers: [
      { id: 'j_egg' },
      { id: 'j_egg' },
      { id: 'j_egg' },
      { id: 'j_egg' },
      { id: 'j_egg' },
    ],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: {
      banned_cards: [
        { id: 'v_seed_money' },
        { id: 'v_money_tree' },
        { id: 'j_to_the_moon' },
        { id: 'j_rocket' },
        { id: 'j_golden' },
        { id: 'j_satellite' },
      ],
      banned_tags: [],
      banned_other: [],
    },
  },
  {
    name: '15 Minute City',
    id: 'c_city_1',
    rules: { custom: [], modifiers: [] },
    jokers: [
      { id: 'j_ride_the_bus', eternal: true },
      { id: 'j_shortcut', eternal: true },
    ],
    consumeables: [],
    vouchers: [],
    deck: {
      type: 'Challenge Deck',
      cards: [
        { s: 'D', r: '4' }, { s: 'D', r: '5' }, { s: 'D', r: '6' }, { s: 'D', r: '7' },
        { s: 'D', r: '8' }, { s: 'D', r: '9' }, { s: 'D', r: 'T' }, { s: 'D', r: 'J' },
        { s: 'D', r: 'Q' }, { s: 'D', r: 'K' }, { s: 'D', r: 'J' }, { s: 'D', r: 'Q' },
        { s: 'D', r: 'K' },
        { s: 'C', r: '4' }, { s: 'C', r: '5' }, { s: 'C', r: '6' }, { s: 'C', r: '7' },
        { s: 'C', r: '8' }, { s: 'C', r: '9' }, { s: 'C', r: 'T' }, { s: 'C', r: 'J' },
        { s: 'C', r: 'Q' }, { s: 'C', r: 'K' }, { s: 'C', r: 'J' }, { s: 'C', r: 'Q' },
        { s: 'C', r: 'K' },
        { s: 'H', r: '4' }, { s: 'H', r: '5' }, { s: 'H', r: '6' }, { s: 'H', r: '7' },
        { s: 'H', r: '8' }, { s: 'H', r: '9' }, { s: 'H', r: 'T' }, { s: 'H', r: 'J' },
        { s: 'H', r: 'Q' }, { s: 'H', r: 'K' }, { s: 'H', r: 'J' }, { s: 'H', r: 'Q' },
        { s: 'H', r: 'K' },
        { s: 'S', r: '4' }, { s: 'S', r: '5' }, { s: 'S', r: '6' }, { s: 'S', r: '7' },
        { s: 'S', r: '8' }, { s: 'S', r: '9' }, { s: 'S', r: 'T' }, { s: 'S', r: 'J' },
        { s: 'S', r: 'Q' }, { s: 'S', r: 'K' }, { s: 'S', r: 'J' }, { s: 'S', r: 'Q' },
        { s: 'S', r: 'K' },
      ],
    },
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [] },
  },
  {
    name: 'Rich get Richer',
    id: 'c_rich_1',
    rules: {
      custom: [{ id: 'chips_dollar_cap' }],
      modifiers: [{ id: 'dollars', value: 100 }],
    },
    jokers: [],
    consumeables: [],
    vouchers: [{ id: 'v_seed_money' }, { id: 'v_money_tree' }],
    deck: { type: 'Challenge Deck' },
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [] },
  },
  {
    name: "On a Knife's Edge",
    id: 'c_knife_1',
    rules: { custom: [], modifiers: [] },
    jokers: [{ id: 'j_ceremonial', eternal: true, pinned: true }],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [] },
  },
  {
    name: 'X-ray Vision',
    id: 'c_xray_1',
    rules: { custom: [{ id: 'flipped_cards', value: 4 }], modifiers: [] },
    jokers: [],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [] },
  },
  {
    name: 'Mad World',
    id: 'c_mad_world_1',
    rules: {
      custom: [{ id: 'no_extra_hand_money' }, { id: 'no_interest' }],
      modifiers: [],
    },
    jokers: [
      { id: 'j_pareidolia', edition: 'negative', eternal: true },
      { id: 'j_business', eternal: true },
    ],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck', cards: [
      { s: 'D', r: '2' }, { s: 'D', r: '3' }, { s: 'D', r: '4' }, { s: 'D', r: '5' },
      { s: 'D', r: '6' }, { s: 'D', r: '7' }, { s: 'D', r: '8' }, { s: 'D', r: '9' },
      { s: 'C', r: '2' }, { s: 'C', r: '3' }, { s: 'C', r: '4' }, { s: 'C', r: '5' },
      { s: 'C', r: '6' }, { s: 'C', r: '7' }, { s: 'C', r: '8' }, { s: 'C', r: '9' },
      { s: 'H', r: '2' }, { s: 'H', r: '3' }, { s: 'H', r: '4' }, { s: 'H', r: '5' },
      { s: 'H', r: '6' }, { s: 'H', r: '7' }, { s: 'H', r: '8' }, { s: 'H', r: '9' },
      { s: 'S', r: '2' }, { s: 'S', r: '3' }, { s: 'S', r: '4' }, { s: 'S', r: '5' },
      { s: 'S', r: '6' }, { s: 'S', r: '7' }, { s: 'S', r: '8' }, { s: 'S', r: '9' },
    ]},
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [{ id: 'bl_plant', type: 'blind' }] },
  },
  {
    name: 'Luxury Tax',
    id: 'c_luxury_1',
    rules: {
      custom: [{ id: 'minus_hand_size_per_X_dollar', value: 5 }],
      modifiers: [{ id: 'hand_size', value: 10 }],
    },
    jokers: [],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: { banned_cards: [], banned_tags: [], banned_other: [] },
  },
  {
    name: 'Non-Perishable',
    id: 'c_non_perishable_1',
    rules: { custom: [{ id: 'all_eternal' }], modifiers: [] },
    jokers: [],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: {
      banned_cards: [
        { id: 'j_gros_michel' }, { id: 'j_ice_cream' }, { id: 'j_cavendish' },
        { id: 'j_turtle_bean' }, { id: 'j_ramen' }, { id: 'j_diet_cola' },
        { id: 'j_selzer' }, { id: 'j_popcorn' }, { id: 'j_mr_bones' },
        { id: 'j_invisible' }, { id: 'j_luchador' },
      ],
      banned_tags: [],
      banned_other: [{ id: 'bl_final_leaf', type: 'blind' }],
    },
  },
  {
    name: 'Inflation',
    id: 'c_inflation_1',
    rules: { custom: [{ id: 'inflation' }], modifiers: [] },
    jokers: [{ id: 'j_credit_card' }],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: {
      banned_cards: [{ id: 'v_clearance_sale' }, { id: 'v_liquidation' }],
      banned_tags: [],
      banned_other: [],
    },
  },
  {
    name: 'Jokerless',
    id: 'c_jokerless_1',
    rules: {
      custom: [{ id: 'no_shop_jokers' }],
      modifiers: [{ id: 'joker_slots', value: 0 }],
    },
    jokers: [],
    consumeables: [],
    vouchers: [],
    deck: { type: 'Challenge Deck' },
    restrictions: {
      banned_cards: [
        { id: 'c_judgement' }, { id: 'c_wraith' }, { id: 'c_soul' }, { id: 'v_antimatter' },
        { id: 'p_buffoon_normal_1', ids: ['p_buffoon_normal_1', 'p_buffoon_normal_2', 'p_buffoon_jumbo_1', 'p_buffoon_mega_1'] },
      ],
      banned_tags: [
        { id: 'tag_rare' }, { id: 'tag_uncommon' }, { id: 'tag_holo' },
        { id: 'tag_polychrome' }, { id: 'tag_negative' }, { id: 'tag_foil' },
        { id: 'tag_buffoon' }, { id: 'tag_top_up' },
      ],
      banned_other: [
        { id: 'bl_final_acorn', type: 'blind' },
        { id: 'bl_final_heart', type: 'blind' },
        { id: 'bl_final_leaf', type: 'blind' },
      ],
    },
  },
];


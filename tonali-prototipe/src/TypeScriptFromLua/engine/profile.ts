/**
 * @file profile.ts
 * @description Gestión de perfiles de jugador, estadísticas y progreso.
 */

/** Estadísticas de carrera del jugador */
export interface CareerStats {
  c_hands_played: number;
  c_face_cards_played: number;
  c_cards_played: number;
  c_cards_discarded: number;
  c_jokers_sold: number;
  c_cards_sold: number;
  c_shop_dollars_spent: number;
  c_shop_rerolls: number;
  c_tarots_bought: number;
  c_planets_bought: number;
  c_playing_cards_bought: number;
  c_tarot_reading_used: number;
  c_planetarium_used: number;
  c_losses: number;
  c_wins: number;
  c_round_interest_cap_streak: number;
  [key: string]: number;
}

/** Tabla de inicialización de un perfil */
export interface ProfileData {
  career_stats: CareerStats;
  hand_usage: Record<string, { count: number; order: number; level: number; mult: number; chips: number }>;
  high_scores: Record<string, { label: string; amt: number }>;
  deck_usage: Record<string, { count: number; wins: number; losses: number; order: number }>;
  joker_usage: Record<string, { count: number; order: number; wins: number; losses: number }>;
  consumeable_usage: Record<string, { count: number; order: number }>;
  voucher_usage: Record<string, { count: number; order: number }>;
  progress: { discovered: Record<string, boolean>; unlocked: Record<string, boolean> };
  ver: number;
  [key: string]: any;
}

/**
 * Inicializa una tabla de perfil vacía con valores por defecto.
 * @returns Datos de perfil inicializados
 */
export function profileInitTable(): ProfileData {
  return {
    career_stats: {
      c_hands_played: 0, c_face_cards_played: 0, c_cards_played: 0,
      c_cards_discarded: 0, c_jokers_sold: 0, c_cards_sold: 0,
      c_shop_dollars_spent: 0, c_shop_rerolls: 0, c_tarots_bought: 0,
      c_planets_bought: 0, c_playing_cards_bought: 0, c_tarot_reading_used: 0,
      c_planetarium_used: 0, c_losses: 0, c_wins: 0, c_round_interest_cap_streak: 0,
    },
    hand_usage: {},
    high_scores: { hand: { label: 'Best Hand', amt: 0 }, furthest_round: { label: 'Highest Round', amt: 0 }, furthest_ante: { label: 'Highest Ante', amt: 0 }, most_money: { label: 'Most Money', amt: 0 }, boss_streak: { label: 'Boss Streak', amt: 0 } },
    deck_usage: {},
    joker_usage: {},
    consumeable_usage: {},
    voucher_usage: {},
    progress: { discovered: {}, unlocked: {} },
    ver: 0,
  };
}

/**
 * Calcula los conteos de descubrimientos para la barra de progreso.
 */
export function setDiscoverTallies(): Record<string, { tally: number; of: number }> {
  return { Joker: { tally: 0, of: 150 }, Tarot: { tally: 0, of: 22 }, Planet: { tally: 0, of: 12 }, Spectral: { tally: 0, of: 18 }, Voucher: { tally: 0, of: 32 }, Back: { tally: 0, of: 15 } };
}


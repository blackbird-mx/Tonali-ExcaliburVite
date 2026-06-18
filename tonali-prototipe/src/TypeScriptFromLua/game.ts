/**
 * @file game.ts
 * @description Clase Game principal que orquesta todas las funcionalidades del juego Balatro.
 * Maneja la inicialización, prototipos de items, carga/guardado de perfil,
 * estados del juego, menú principal y flujo general.
 */

import { GameState, GameStage, Settings, VERSION } from './globals';
import { Back } from './back';
import { Blind } from './blind';
import { CardArea } from './cardarea';

/** Objeto del juego actual (datos de la partida en progreso) */
export interface GameObject {
  selected_back: Back;
  dollars: number;
  round_resets: {
    ante: number;
    hands: number;
    discards: number;
    reroll_cost: number;
    blind_ante?: number;
    temp_handsize?: number;
    temp_reroll_cost?: number;
    [key: string]: any;
  };
  blind: Blind;
  hands_played: number;
  current_round: Record<string, any>;
  used_jokers: Record<string, boolean>;
  used_vouchers: Record<string, boolean>;
  consumeable_usage: Record<string, any>;
  consumeable_usage_total?: Record<string, number>;
  probabilities: Record<string, number>;
  inflation: number;
  discount_percent: number;
  interest_amount: number;
  interest_cap: number;
  bankrupt_at: number;
  starting_deck_size: number;
  max_jokers: number;
  skips: number;
  unused_discards: number;
  perishable_rounds: number;
  modifiers: Record<string, any>;
  tags: any[];
  won: boolean;
  [key: string]: any;
}

/**
 * Clase Game: Controlador principal del juego.
 * Gestiona el ciclo de vida completo: inicialización, estados, carga/guardado,
 * prototipos de items y transiciones entre pantallas.
 */
export class Game {
  /** Versión del juego */
  VERSION: string = VERSION;
  /** Estado actual del juego */
  STATE: GameState = GameState.SPLASH;
  /** Etapa actual (menú, run, etc.) */
  STAGE: GameStage = GameStage.MAIN_MENU;
  /** Si el estado actual se completó */
  STATE_COMPLETE: boolean = false;
  /** Configuración general */
  SETTINGS: Settings;
  /** Objeto del juego actual */
  GAME: GameObject;
  /** Prototipos de cartas centrales (jokers, tarots, etc.) */
  P_CENTERS: Record<string, any> = {};
  /** Cartas base del mazo */
  P_CARDS: Record<string, any> = {};
  /** Prototipos de blinds */
  P_BLINDS: Record<string, any> = {};
  /** Prototipos de tags */
  P_TAGS: Record<string, any> = {};
  /** Prototipos de sellos */
  P_SEALS: Record<string, any> = {};
  /** Prototipos de stakes */
  P_STAKES: Record<string, any> = {};
  /** Pools de centros por tipo */
  P_CENTER_POOLS: Record<string, any[]> = {};
  /** Pools de rareza de jokers */
  P_JOKER_RARITY_POOLS: any[][] = [[], [], [], []];
  /** Items bloqueados */
  P_LOCKED: any[] = [];
  /** Áreas de cartas activas */
  hand?: CardArea;
  deck?: CardArea;
  jokers?: CardArea;
  consumeables?: CardArea;
  play?: CardArea;

  constructor() {
    this.SETTINGS = this.getDefaultSettings();
    this.GAME = this.initGameObject();
  }

  /**
   * Inicializa el juego: event manager, carga de archivos, shaders, controladores.
   */
  startUp(): void {
    this.loadAllFiles();
    this.setLanguage();
    this.initItemPrototypes();
  }

  /**
   * Crea la configuración de settings por defecto.
   */
  private getDefaultSettings(): Settings {
    return {
      COMP: { name: '', prev_name: '', submission_name: null, score: 0 },
      DEMO: { total_uptime: 0, timed_CTA_shown: false, win_CTA_shown: false, quit_CTA_shown: false },
      ACHIEVEMENTS_EARNED: {},
      crashreports: false,
      colourblind_option: false,
      language: 'en-us',
      screenshake: true,
      run_stake_stickers: false,
      rumble: null,
      play_button_pos: 2,
      GAMESPEED: 1,
      paused: false,
      profile_counters: [0, 0, 0],
      SOUND: { volume: 50, music_volume: 100, game_sounds_volume: 100 },
      WINDOW: {
        screenmode: 'Borderless',
        vsync: 1,
        selected_display: 1,
        display_names: ['[NONE]'],
        DISPLAYS: [{ name: '[NONE]', screen_res: { w: 1000, h: 650 } }],
      },
      CUSTOM_DECK: { Collabs: { Spades: 'default', Hearts: 'default', Clubs: 'default', Diamonds: 'default' } },
      GRAPHICS: { texture_scaling: 2, shadows: 'On', crt: 70, bloom: 1 },
    };
  }

  /**
   * Inicializa el objeto del juego (nueva partida o reset).
   * @returns Un nuevo GameObject con valores por defecto
   */
  initGameObject(): GameObject {
    return {
      selected_back: new Back(),
      dollars: 4,
      round_resets: {
        ante: 1,
        hands: 4,
        discards: 3,
        reroll_cost: 5,
      },
      blind: new Blind(),
      hands_played: 0,
      current_round: {},
      used_jokers: {},
      used_vouchers: {},
      consumeable_usage: {},
      probabilities: { normal: 1 },
      inflation: 0,
      discount_percent: 0,
      interest_amount: 1,
      interest_cap: 25,
      bankrupt_at: -5,
      starting_deck_size: 52,
      max_jokers: 0,
      skips: 0,
      unused_discards: 0,
      perishable_rounds: 5,
      modifiers: {},
      tags: [],
      won: false,
    };
  }

  /**
   * Inicializa todos los prototipos de items (jokers, tarots, planetas, vouchers, etc.).
   * Crea los pools por tipo, aplica descubrimientos y desbloqueos del perfil.
   */
  initItemPrototypes(): void {
    // Inicializar P_CARDS con las 52 cartas estándar
    const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
    const suitCodes = ['H', 'C', 'D', 'S'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const valueCodes = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

    for (let s = 0; s < 4; s++) {
      for (let v = 0; v < 13; v++) {
        const key = `${suitCodes[s]}_${valueCodes[v]}`;
        this.P_CARDS[key] = {
          name: `${values[v]} of ${suits[s]}`,
          value: values[v],
          suit: suits[s],
          pos: { x: v, y: s },
        };
      }
    }

    // Inicializar P_CENTER_POOLS vacíos
    this.P_CENTER_POOLS = {
      Booster: [], Default: [], Enhanced: [], Edition: [],
      Joker: [], Tarot: [], Planet: [], Tarot_Planet: [],
      Spectral: [], Consumeables: [], Voucher: [], Back: [],
      Tag: [], Seal: [], Stake: [], Demo: [],
    };
  }

  /**
   * Carga todos los archivos necesarios (profiles, saves, settings).
   */
  loadAllFiles(): void {
    // Implementación de carga de archivos del sistema
  }

  /**
   * Establece el idioma del juego y carga las localizaciones.
   */
  setLanguage(): void {
    // Implementación de carga de idioma
  }

  /**
   * Guarda el progreso del juego (descubrimientos, desbloqueos).
   */
  saveProgress(): void {
    // Serialización y guardado en almacenamiento
  }

  /**
   * Carga el perfil del jugador.
   * @param profile - Número de perfil (1-3)
   */
  loadProfile(profile: number): void {
    // Carga del perfil desde almacenamiento
  }

  /**
   * Prepara una nueva etapa del juego (menú, run, sandbox).
   * @param newStage - Nueva etapa
   * @param newState - Nuevo estado
   * @param newGameObj - Si crear un nuevo objeto de juego
   */
  prepStage(newStage?: GameStage, newState?: GameState, newGameObj?: boolean): void {
    if (newGameObj) {
      this.GAME = this.initGameObject();
    }
    this.STAGE = newStage || GameStage.MAIN_MENU;
    this.STATE = newState || GameState.MENU;
    this.STATE_COMPLETE = false;
  }

  /**
   * Muestra el menú principal del juego.
   * @param changeContext - Contexto de transición ('splash', 'game' o undefined)
   */
  mainMenu(changeContext?: 'splash' | 'game'): void {
    this.prepStage(GameStage.MAIN_MENU, GameState.MENU, true);
    this.GAME.selected_back = new Back();
  }

  /**
   * Elimina la partida actual y limpia el estado.
   */
  deleteRun(): void {
    this.hand = undefined;
    this.deck = undefined;
    this.jokers = undefined;
    this.consumeables = undefined;
    this.play = undefined;
    this.STATE = -1 as any;
  }

  /**
   * Muestra la pantalla de splash/intro del juego.
   */
  splashScreen(): void {
    if (this.SETTINGS.skip_splash === 'Yes') {
      this.mainMenu();
      return;
    }
    this.prepStage(GameStage.MAIN_MENU, GameState.SPLASH, true);
  }
}

/** Instancia global del juego */
export const G = new Game();


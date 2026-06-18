/**
 * @file UI_definitions.ts
 * @description Definiciones de layouts de UI: constructores de componentes visuales del juego.
 */

import { UIDefinitionNode } from '../engine/ui';

/** Configuración de un slider UI */
export interface SliderConfig {
  label: string; w: number; h: number; text_scale?: number; label_scale?: number;
  ref_table: any; ref_value: string; min: number; max: number;
  decimal_places?: number; callback?: string;
}

/** Configuración de un ciclo de opciones */
export interface OptionCycleConfig {
  options: string[]; opt_callback: string; current_option: number;
  colour?: any; w?: number; scale?: number;
}

/**
 * Crea un componente slider para la UI.
 * @param config - Configuración del slider
 * @returns Nodo de definición de UI
 */
export function createSlider(config: SliderConfig): UIDefinitionNode {
  return { n: 8, config: { ...config } }; // UIT.S = 8
}

/**
 * Crea un ciclo de opciones (select cíclico).
 * @param config - Configuración del ciclo
 * @returns Nodo de definición de UI
 */
export function createOptionCycle(config: OptionCycleConfig): UIDefinitionNode {
  return { n: 4, config: { ...config }, nodes: [] };
}

/**
 * Crea un campo de texto editable.
 * @param config - Configuración del input
 * @returns Nodo de definición de UI
 */
export function createTextInput(config: { prompt_text: string; ref_table: any; ref_value: string; text_scale?: number; w?: number; h?: number; extended_corpus?: boolean }): UIDefinitionNode {
  return { n: 9, config: { ...config } }; // UIT.I = 9
}

/**
 * Crea un botón genérico de UI.
 * @param params - Configuración del botón
 * @returns Nodo de definición de UI
 */
export function UIBoxButton(params: { label: string[]; button: string; minw?: number; col?: boolean; colour?: any; func?: string }): UIDefinitionNode {
  return { n: 4, config: { align: 'cm', ...params }, nodes: [{ n: 1, config: { text: params.label.join(' '), scale: 0.5 } }] };
}

/**
 * Crea el botón del personaje (Jimbo) durante el tutorial.
 * @param params - Texto, función, color, maxw
 * @returns Definición de UIBox
 */
export function createUIBoxCharacterButton(params: { button: string; func: string; colour?: any; update_func?: string; maxw?: number }): UIDefinitionNode {
  return {
    n: 7, // ROOT
    config: { align: 'cm', colour: [0, 0, 0, 0] },
    nodes: [{ n: 4, config: { align: 'cm', padding: 0.1, r: 0.1, colour: params.colour, button: params.button, func: params.func }, nodes: [{ n: 1, config: { text: params.button, scale: 0.45 } }] }],
  };
}

/**
 * Configura la UI del menú principal.
 */
export function setMainMenuUI(): void {
  // Crear el layout del menú principal (Play, Options, Collection, Quit)
}

/**
 * Crea la UI de info de una carta en la tienda.
 * @param card - Carta de la tienda
 * @param type - Tipo (Joker, Booster, Voucher)
 * @param area - Área de la tienda
 */
export function createShopCardUI(card: any, type: string, area: any): void {
  // Generar tooltip con nombre, descripción, costo
}

/**
 * Genera la UI de tooltip/popup de una carta.
 * @param center - Centro de la carta
 * @param vars - Variables para localización
 * @param locVars - Variables locales adicionales
 * @param cardType - Tipo de carta para el formato
 * @returns Definición de UIBox para el popup
 */
export function generateCardUI(center: any, vars?: any, locVars?: any[], cardType?: string): UIDefinitionNode {
  return { n: 7, config: { align: 'cm' }, nodes: [] };
}


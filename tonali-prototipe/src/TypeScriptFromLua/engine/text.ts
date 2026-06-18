/**
 * @file text.ts
 * @description Texto dinámico con animaciones (DynaText).
 */
import { Moveable } from './moveable';

export interface DynaTextConfig {
  string: string | string[]; scale?: number; colours?: any[]; shadow?: boolean;
  bump?: boolean; pop_in?: number; pop_in_rate?: number; maxw?: number;
}

/**
 * Clase DynaText: Texto animado con efectos de bump, pop-in y colores variables.
 */
export class DynaText extends Moveable {
  config: DynaTextConfig;
  strings: string[];
  currentIndex: number = 0;
  scale: number;

  constructor(config: DynaTextConfig) {
    super(0, 0, 0, 0);
    this.config = config;
    this.strings = Array.isArray(config.string) ? config.string : [config.string];
    this.scale = config.scale || 1;
  }

  /** Actualiza la cadena mostrada */
  update_text(newString: string): void { this.strings = [newString]; }
  /** Reproduce animación de pulso */
  pulse(amount?: number): void { /* animación */ }
  /** Cambia los colores del texto */
  update_colours(colours: any[]): void { this.config.colours = colours; }
}


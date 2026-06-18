/**
 * @file sprite.ts
 * @description Clase Sprite para renderizado de texturas con shaders y efectos.
 */
import { Moveable } from './moveable';

/** Paso de dibujado con shader */
export interface DrawStep {
  shader?: string;
  shadow_height?: number;
  send?: Array<{ name: string; val?: number; ref_table?: any; ref_value?: string }>;
}

/**
 * Clase Sprite: Renderiza una textura desde un atlas con efectos de shader.
 */
export class Sprite extends Moveable {
  /** Atlas de texturas */
  atlas: any;
  /** Posición en el atlas */
  pos: { x: number; y: number };
  /** Pasos de dibujado configurados */
  draw_steps: DrawStep[] = [];
  /** Valor de disolución (0=visible, 1=disuelto) */
  dissolve: number = 0;
  /** Colores de disolución */
  dissolve_colours: any[] = [];
  /** Si flota con animación */
  float: boolean = false;

  constructor(x: number, y: number, w: number, h: number, atlas: any, pos?: { x: number; y: number }) {
    super(x, y, w, h);
    this.atlas = atlas;
    this.pos = pos || { x: 0, y: 0 };
  }

  /** Define los pasos de dibujado (shaders) */
  define_draw_steps(steps: DrawStep[]): void { this.draw_steps = steps; }

  /** Aplica efecto de "juice" (rebote/sacudida) */
  juice_up(scale?: number, rot?: number): void { /* animación */ }

  /** Inicia animación de materialización */
  start_materialize(colours?: any[], silent?: boolean, speed?: number): void { /* animación */ }

  /** Inicia animación de disolución */
  start_dissolve(colours?: any[], silent?: boolean, speed?: number, noRemove?: boolean): void { /* animación */ }

  /** Dibuja el sprite */
  draw(layer?: string): void { /* renderizado */ }

  /** Resetea el sprite a su estado base */
  reset(): void { this.dissolve = 0; }

  /** Establece alineación respecto a un nodo mayor */
  set_alignment(config: { major?: any; type?: string; offset?: { x: number; y: number }; bond?: string }): void { /* alineación */ }
}


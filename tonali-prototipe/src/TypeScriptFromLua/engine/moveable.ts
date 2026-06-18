/**
 * @file moveable.ts
 * @description Clase Moveable que extiende Node con movimiento, velocidad y parallax de sombra.
 */
import { Node, Transform } from './node';

/**
 * Clase Moveable: Nodo que puede moverse suavemente entre posiciones con interpolación.
 */
export class Moveable extends Node {
  /** Transformación visual (interpolada) */
  VT: Transform;
  /** Parallax de la sombra */
  shadow_parrallax: { x: number; y: number } = { x: 0, y: 0 };
  /** Velocidad de movimiento */
  velocity: { x: number; y: number } = { x: 0, y: 0 };

  constructor(x = 0, y = 0, w = 1, h = 1) {
    super({ T: { x, y, w, h, r: 0, scale: 1 } });
    this.VT = { ...this.T };
  }

  /** Actualiza la posición visual con interpolación */
  move(dt: number): void {
    const rate = Math.min(dt * 15, 1);
    this.VT.x += (this.T.x - this.VT.x) * rate;
    this.VT.y += (this.T.y - this.VT.y) * rate;
    this.VT.w += (this.T.w - this.VT.w) * rate;
    this.VT.h += (this.T.h - this.VT.h) * rate;
    this.VT.r += (this.T.r - this.VT.r) * rate;
  }

  /** Establece la transformación sin interpolación */
  hard_set_T(x?: number, y?: number, w?: number, h?: number): void {
    this.T.x = x ?? this.T.x; this.T.y = y ?? this.T.y;
    this.T.w = w ?? this.T.w; this.T.h = h ?? this.T.h;
    this.VT = { ...this.T };
  }

  /** Calcula el parallax de sombra basado en posición */
  calculate_parrallax(): void {
    this.shadow_parrallax = { x: 0.15 * (this.T.x - 10), y: 0.15 * (this.T.y - 5) };
  }

  /** Elimina el nodo */
  remove(): void { this.states.visible = false; }
}


/**
 * @file animatedsprite.ts
 * @description Sprite animado con múltiples frames y reproducción automática.
 */
import { Sprite } from './sprite';

/**
 * Clase AnimatedSprite: Sprite con animación de frames en secuencia.
 */
export class AnimatedSprite extends Sprite {
  /** Número total de frames */
  frames: number;
  /** Frames por segundo de la animación */
  fps: number;
  /** Frame actual */
  currentFrame: number = 0;
  /** Temporizador interno */
  timer: number = 0;

  constructor(x: number, y: number, w: number, h: number, atlas: any, pos: { x: number; y: number }, frames: number, fps = 10) {
    super(x, y, w, h, atlas, pos);
    this.frames = frames;
    this.fps = fps;
  }

  /** Avanza la animación según el delta time */
  update(dt: number): void {
    this.timer += dt;
    if (this.timer >= 1 / this.fps) {
      this.timer -= 1 / this.fps;
      this.currentFrame = (this.currentFrame + 1) % this.frames;
    }
  }
}


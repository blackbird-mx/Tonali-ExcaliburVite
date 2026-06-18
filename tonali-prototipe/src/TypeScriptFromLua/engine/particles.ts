/**
 * @file particles.ts
 * @description Sistema de partículas decorativas.
 */
import { Moveable } from './moveable';

export interface ParticleConfig {
  timer: number; scale: number; speed: number; lifespan: number;
  attach?: any; colours: any[]; fill?: boolean;
}

/** Partícula individual */
interface Particle { x: number; y: number; vx: number; vy: number; life: number; colour: any; scale: number; }

/**
 * Clase Particles: Emisor de partículas visuales decorativas.
 */
export class Particles extends Moveable {
  config: ParticleConfig;
  particles: Particle[] = [];
  timer: number = 0;
  static_rotation: boolean = false;

  constructor(x: number, y: number, w: number, h: number, config: ParticleConfig) {
    super(x, y, w, h);
    this.config = config;
  }

  update(dt: number): void {
    this.timer += dt;
    if (this.timer >= this.config.timer) {
      this.timer = 0;
      this.emit();
    }
    this.particles = this.particles.filter(p => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.life > 0; });
  }

  private emit(): void {
    const angle = Math.random() * Math.PI * 2;
    this.particles.push({
      x: this.T.x + this.T.w / 2, y: this.T.y + this.T.h / 2,
      vx: Math.cos(angle) * this.config.speed, vy: Math.sin(angle) * this.config.speed,
      life: this.config.lifespan, colour: this.config.colours[Math.floor(Math.random() * this.config.colours.length)],
      scale: this.config.scale,
    });
  }

  set_role(config: any): void { /* configurar rol/alineación */ }
}


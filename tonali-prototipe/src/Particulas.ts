import * as Motor from 'excalibur';

/**
 * Configuration for the particle system.
 */
export interface ParticulasConfig {
  /** Position of the emitter in world space */
  pos?: Motor.Vector;
  /** Number of particles to emit per second */
  emitRate?: number;
  /** Maximum number of particles alive at once */
  maxParticulas?: number;
  /** Lifetime of each particle in milliseconds */
  vida?: number;
  /** Random variation on lifetime (±ms) */
  vidaVariacion?: number;
  /** Initial speed of particles (pixels/sec) */
  velocidad?: number;
  /** Random variation on speed */
  velocidadVariacion?: number;
  /** Direction angle in radians (0 = right, PI/2 = down) */
  angulo?: number;
  /** Spread angle in radians around the direction */
  anguloDispersion?: number;
  /** Gravity acceleration applied to particles (pixels/sec²) */
  gravedad?: Motor.Vector;
  /** Initial particle size in pixels */
  tamano?: number;
  /** Final particle size (scales over lifetime) */
  tamanoFinal?: number;
  /** Random variation on size */
  tamanoVariacion?: number;
  /** Start color */
  color?: Motor.Color;
  /** End color (fades over lifetime) */
  colorFinal?: Motor.Color;
  /** Initial opacity (0–1) */
  opacidad?: number;
  /** Final opacity (fades over lifetime) */
  opacidadFinal?: number;
  /** Whether to emit continuously or in a single burst */
  continuo?: boolean;
  /** Number of particles in a burst (if not continuous) */
  burst?: number;
  /** Shape of particles: 'circle' | 'square' | 'star' */
  forma?: 'circle' | 'square' | 'star';
  /** Initial rotation speed in rad/sec */
  rotacionVelocidad?: number;
  /** Friction/drag factor (0 = none, 1 = full stop) */
  friccion?: number;
}

/**
 * Internal particle data.
 */
interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  vidaMax: number;
  tamano: number;
  tamanoFinal: number;
  rotacion: number;
  rotacionVel: number;
  color: Motor.Color;
  colorFinal: Motor.Color;
  opacidad: number;
  opacidadFinal: number;
}

/**
 * Generic particle system for Excalibur.
 *
 * Usage:
 * ```ts
 * const particulas = new Particulas({
 *   pos: vec(400, 300),
 *   emitRate: 50,
 *   vida: 1000,
 *   velocidad: 100,
 *   color: Color.Yellow,
 *   colorFinal: Color.Red,
 *   forma: 'circle',
 * });
 * scene.add(particulas);
 * particulas.emitir(); // start emitting
 * ```
 */
export class Particulas extends Motor.Actor {
  private config: Required<ParticulasConfig>;
  private particulas: Particula[] = [];
  private emitiendo: boolean = false;
  private acumulador: number = 0;

  constructor(config: ParticulasConfig = {}) {
    super({
      name: 'Particulas',
      pos: config.pos ?? Motor.vec(0, 0),
      anchor: Motor.vec(0.5, 0.5),
    });

    // Fill defaults
    this.config = {
      pos: config.pos ?? Motor.vec(0, 0),
      emitRate: config.emitRate ?? 30,
      maxParticulas: config.maxParticulas ?? 200,
      vida: config.vida ?? 1000,
      vidaVariacion: config.vidaVariacion ?? 200,
      velocidad: config.velocidad ?? 100,
      velocidadVariacion: config.velocidadVariacion ?? 20,
      angulo: config.angulo ?? -Math.PI / 2, // default: upward
      anguloDispersion: config.anguloDispersion ?? Math.PI / 4,
      gravedad: config.gravedad ?? Motor.vec(0, 100),
      tamano: config.tamano ?? 6,
      tamanoFinal: config.tamanoFinal ?? 1,
      tamanoVariacion: config.tamanoVariacion ?? 2,
      color: config.color ?? Motor.Color.Yellow,
      colorFinal: config.colorFinal ?? Motor.Color.Red,
      opacidad: config.opacidad ?? 1,
      opacidadFinal: config.opacidadFinal ?? 0,
      continuo: config.continuo ?? true,
      burst: config.burst ?? 20,
      forma: config.forma ?? 'circle',
      rotacionVelocidad: config.rotacionVelocidad ?? 0,
      friccion: config.friccion ?? 0,
    };
  }

  override onInitialize(): void {
    // Use the graphics component's onPostDraw to render particles
    this.graphics.onPostDraw = (ctx) => {
      this.dibujarParticulas(ctx);
    };
  }

  /**
   * Start continuous emission.
   */
  emitir(): void {
    this.emitiendo = true;
  }

  /**
   * Stop continuous emission. Existing particles will finish their life.
   */
  detener(): void {
    this.emitiendo = false;
  }

  /**
   * Emit a one-time burst of particles.
   */
  explotar(cantidad?: number): void {
    const n = cantidad ?? this.config.burst;
    for (let i = 0; i < n; i++) {
      this.crearParticula();
    }
  }

  /**
   * Remove all active particles immediately.
   */
  limpiar(): void {
    this.particulas = [];
  }

  /**
   * Check if system is currently emitting.
   */
  get activo(): boolean {
    return this.emitiendo;
  }

  /**
   * Get number of currently alive particles.
   */
  get cantidadActual(): number {
    return this.particulas.length;
  }

  override onPreUpdate(_engine: Motor.Engine, elapsedMs: number): void {
    const dt = elapsedMs / 1000; // seconds

    // Emit new particles
    if (this.emitiendo) {
      this.acumulador += elapsedMs;
      const interval = 1000 / this.config.emitRate;
      while (this.acumulador >= interval && this.particulas.length < this.config.maxParticulas) {
        this.crearParticula();
        this.acumulador -= interval;
      }
    }

    // Update existing particles
    for (let i = this.particulas.length - 1; i >= 0; i--) {
      const p = this.particulas[i];
      p.vida -= elapsedMs;

      if (p.vida <= 0) {
        this.particulas.splice(i, 1);
        continue;
      }

      // Apply gravity
      p.vx += this.config.gravedad.x * dt;
      p.vy += this.config.gravedad.y * dt;

      // Apply friction
      if (this.config.friccion > 0) {
        const drag = 1 - this.config.friccion * dt;
        p.vx *= drag;
        p.vy *= drag;
      }

      // Move
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Rotate
      p.rotacion += p.rotacionVel * dt;
    }
  }

  private dibujarParticulas(ctx: Motor.ExcaliburGraphicsContext): void {
    for (const p of this.particulas) {
      const t = 1 - (p.vida / p.vidaMax); // 0 at birth, 1 at death

      // Interpolate size
      const size = Motor.clamp(this.lerp(p.tamano, p.tamanoFinal, t), 0.1, 100);

      // Interpolate opacity
      const opacity = Motor.clamp(this.lerp(p.opacidad, p.opacidadFinal, t), 0, 1);

      // Interpolate color
      const r = Math.round(this.lerp(p.color.r, p.colorFinal.r, t));
      const g = Math.round(this.lerp(p.color.g, p.colorFinal.g, t));
      const b = Math.round(this.lerp(p.color.b, p.colorFinal.b, t));
      const color = new Motor.Color(r, g, b, opacity);

      ctx.save();
      ctx.translate(p.x, p.y);

      if (p.rotacion !== 0) {
        ctx.rotate(p.rotacion);
      }

      this.dibujarForma(ctx, size, color);

      ctx.restore();
    }
  }

  private dibujarForma(ctx: Motor.ExcaliburGraphicsContext, size: number, color: Motor.Color): void {
    switch (this.config.forma) {
      case 'square':
        ctx.drawRectangle(
          Motor.vec(-size / 2, -size / 2),
          size,
          size,
          color,
        );
        break;
      case 'star':
        // Draw a simple star as overlapping rotated squares
        ctx.drawRectangle(Motor.vec(-size / 2, -size / 2), size, size, color);
        ctx.save();
        ctx.rotate(Math.PI / 4);
        ctx.drawRectangle(Motor.vec(-size / 2, -size / 2), size, size, color);
        ctx.restore();
        break;
      case 'circle':
      default:
        ctx.drawCircle(Motor.vec(0, 0), size / 2, color);
        break;
    }
  }

  private crearParticula(): void {
    const cfg = this.config;

    // Random angle within dispersion
    const angulo = cfg.angulo + (Math.random() - 0.5) * cfg.anguloDispersion * 2;

    // Random speed
    const speed = cfg.velocidad + (Math.random() - 0.5) * cfg.velocidadVariacion * 2;

    // Random lifetime
    const vida = cfg.vida + (Math.random() - 0.5) * cfg.vidaVariacion * 2;

    // Random size
    const tamano = cfg.tamano + (Math.random() - 0.5) * cfg.tamanoVariacion * 2;

    const particula: Particula = {
      x: 0,
      y: 0,
      vx: Math.cos(angulo) * speed,
      vy: Math.sin(angulo) * speed,
      vida: vida,
      vidaMax: vida,
      tamano: tamano,
      tamanoFinal: cfg.tamanoFinal,
      rotacion: Math.random() * Math.PI * 2,
      rotacionVel: (Math.random() - 0.5) * cfg.rotacionVelocidad * 2,
      color: cfg.color.clone(),
      colorFinal: cfg.colorFinal.clone(),
      opacidad: cfg.opacidad,
      opacidadFinal: cfg.opacidadFinal,
    };

    this.particulas.push(particula);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}






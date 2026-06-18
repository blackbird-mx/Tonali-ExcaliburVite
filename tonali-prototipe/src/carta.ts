import * as Motor from 'excalibur';
import {CartasSpriteSheet, FondosSpriteSheet} from './recursos';
import {CartaColor} from './CartaColor';
import {CartaPalo} from './CartaPalo';
import {CartaAnimacion} from './CartaAnimacion';

// Row 0: Corazon (red), Row 1: Trebol (black), Row 2: Diamante (red), Row 3: Espada (black)
//const PALO_POR_FILA: CartaPalo[] = [CartaPalo.Corazon, CartaPalo.Trebol, CartaPalo.Diamante, CartaPalo.Espada];
//const COLOR_POR_FILA: CartaColor[] = [CartaColor.Rojo, CartaColor.Negro, CartaColor.Rojo, CartaColor.Negro];

export class Carta extends Motor.Actor {
  private spriteIndex: number;
  private fondoIndex: number;
  public debug: boolean;
  public selected: boolean = false;
  public selectable: boolean = true; // Enable/disable selection interactivity
  private originalPos: Motor.Vector = Motor.vec(0, 0);
  private fondoSprite: Motor.Sprite | null = null;
  private animacionActiva: CartaAnimacion = CartaAnimacion.Ninguna;
  private tiempoAnimacion: number = 0;
  private animacionIndice: number = 0; // used for staggering multiple cards
  private animacionPausada: CartaAnimacion = CartaAnimacion.Ninguna; // stored while selected
  private cardScale: number = 1.0; // Card size scale factor

  public paloColor?: CartaColor;
  public palo?: CartaPalo;
  public valor?: number;

  constructor(spriteIndex: number = 0,
              fondoIndex: number = 1,
              debug: boolean = true,
              palo?: CartaPalo,
              color?: CartaColor,
              valor?: number,
              cardScale: number = 1.0 ) {
    super({
      name: 'Carta',
      scale: Motor.vec(cardScale, cardScale),
    });
    this.spriteIndex = spriteIndex;
    this.fondoIndex = fondoIndex;
    this.debug = debug;
    this.cardScale = cardScale;
    this.palo = palo;
    this.paloColor = color;
    this.valor = (spriteIndex % 13) + 1; // 1–13
  }

  override onInitialize(): void {
    this.originalPos = this.pos.clone();

    this.on('pointerdown', () => {
      // Don't allow selection if selectable is disabled
      if (!this.selectable) return;

      if (!this.selected) {
        this.selected = true;
        // Pause animation and reset transforms
        this.animacionPausada = this.animacionActiva;
        this.animacionActiva = CartaAnimacion.Ninguna;
        this.rotation = 0;
        this.scale = Motor.vec(this.cardScale, this.cardScale);
        this.actions.clearActions();
        // Snap to original position before moving up (prevents diagonal movement)
        this.pos = this.originalPos.clone();

        if (this.fondoSprite) {
          this.fondoSprite.tint = Motor.Color.fromHex("#B15454B5");
        }
        this.actions.easeTo(this.originalPos.add(Motor.vec(0, -50)), 300, Motor.EasingFunctions.EaseInOutCubic);
      } else {
        this.selected = false;
        if (this.fondoSprite) {
          this.fondoSprite.tint = Motor.Color.Transparent;
        }
        this.actions.clearActions();
        // Return to original position, then resume animation
        this.actions.easeTo(this.originalPos, 300, Motor.EasingFunctions.EaseInOutCubic)
          .callMethod(() => {
            if (this.animacionPausada !== CartaAnimacion.Ninguna) {
              this.iniciarAnimacion(this.animacionPausada, this.animacionIndice);
              this.animacionPausada = CartaAnimacion.Ninguna;
            }
          });
      }
    });

    // Background sprite from FondosSpriteSheet
    const fondoOriginal = FondosSpriteSheet.getSprite(
      this.fondoIndex % 7,
      Math.floor(this.fondoIndex / 7)
    );
    const fondo = fondoOriginal?.clone() ?? null;
    this.fondoSprite = fondo;

    // Card face sprite from CartasSpriteSheet
    const sprite = CartasSpriteSheet.getSprite(
      this.spriteIndex % 13,
      Math.floor(this.spriteIndex / 13)
    );

    const group = new Motor.GraphicsGroup({
      members: [
        ...(fondo ? [{ graphic: fondo, offset: Motor.vec(0, 0) }] : []),
        ...(sprite ? [{ graphic: sprite, offset: Motor.vec(0, 0) }] : []),
      ],
    });
    this.graphics.use(group);

    if (this.debug) {
      this.graphics.onPostDraw = (ctx) => {
        const bounds = this.graphics.localBounds;
        ctx.drawRectangle(
          Motor.vec(bounds.left, bounds.top),
          bounds.width,
          bounds.height,
          Motor.Color.Transparent,
          Motor.Color.Red,
          2
        );
      };
    }
  }

  /**
   * Start an idle animation on this card.
   * @param tipo The animation type
   * @param indice Optional index for staggering (e.g. card position in hand)
   */
  iniciarAnimacion(tipo: CartaAnimacion, indice: number = 0): void {
    this.animacionActiva = tipo;
    this.animacionIndice = indice;
    this.tiempoAnimacion = 0;
    // Always refresh originalPos to the current position so animations
    // and selection use the correct reference after repositioning.
    this.originalPos = this.pos.clone();

    // One-shot animations using action sequences
    if (tipo === CartaAnimacion.Rebotar) {
      this.animarRebotar();
    } else if (tipo === CartaAnimacion.Deslizar) {
      this.animarDeslizar();
    } else if (tipo === CartaAnimacion.Girar) {
      this.animarGirar();
    }
  }

  /**
   * Stop the current animation and reset transforms.
   */
  detenerAnimacion(): void {
    this.animacionActiva = CartaAnimacion.Ninguna;
    this.tiempoAnimacion = 0;
    // Reset rotation, but preserve cardScale
    this.rotation = 0;
    this.scale = Motor.vec(this.cardScale, this.cardScale);
  }

  override onPreUpdate(_engine: Motor.Engine, elapsedMs: number): void {
    if (this.animacionActiva === CartaAnimacion.Ninguna) return;

    this.tiempoAnimacion += elapsedMs;
    const t = this.tiempoAnimacion / 1000; // seconds
    const offset = this.animacionIndice * 0.4; // stagger per card

    switch (this.animacionActiva) {
      case CartaAnimacion.Flotar:
        // Smooth sine-wave floating up and down
        this.pos = this.pos.clone();
        this.pos.y = this.originalPos.y + Math.sin((t + offset) * 2) * 8;
        break;

      case CartaAnimacion.Tambalear:
        // Wobble rotation side-to-side
        this.rotation = Math.sin((t + offset) * 3) * 0.06;
        break;

      case CartaAnimacion.Pulsar:
        // Breathing scale effect, relative to cardScale
        const s = this.cardScale * (1 + Math.sin((t + offset) * 2.5) * 0.05);
        this.scale = Motor.vec(s, s);
        break;

      // Girar, Rebotar, Deslizar are one-shot action-based (handled in iniciarAnimacion)
      default:
        break;
    }
  }

  /** Bounce in from above using action sequence */
  private animarRebotar(): void {
    const destino = this.pos.clone();
    this.pos = Motor.vec(this.pos.x, this.pos.y - 300);
    this.actions
      .easeTo(destino.add(Motor.vec(0, 20)), 400, Motor.EasingFunctions.EaseInCubic)
      .easeTo(destino, 200, Motor.EasingFunctions.EaseOutCubic);
  }

  /** Slide in from the left using action sequence */
  private animarDeslizar(): void {
    const destino = this.pos.clone();
    this.pos = Motor.vec(this.pos.x - 600, this.pos.y);
    this.actions
      .easeTo(destino, 500 + this.animacionIndice * 100, Motor.EasingFunctions.EaseOutCubic);
  }

  /** Spin 360° once */
  private animarGirar(): void {
    this.actions.rotateBy(Math.PI * 2, Math.PI * 2); // full rotation at π*2 rad/s = 1 sec
  }
}
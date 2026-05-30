import * as Motor from 'excalibur';
import {CartasSpriteSheet, FondosSpriteSheet} from './recursos';
import {CartaColor} from './CartaColor';
import {CartaPalo} from './CartaPalo';

// Row 0: Corazon (red), Row 1: Trebol (black), Row 2: Diamante (red), Row 3: Espada (black)
//const PALO_POR_FILA: CartaPalo[] = [CartaPalo.Corazon, CartaPalo.Trebol, CartaPalo.Diamante, CartaPalo.Espada];
//const COLOR_POR_FILA: CartaColor[] = [CartaColor.Rojo, CartaColor.Negro, CartaColor.Rojo, CartaColor.Negro];

export class Carta extends Motor.Actor {
  private spriteIndex: number;
  private fondoIndex: number;
  public debug: boolean;
  public selected: boolean = false;
  private originalPos: Motor.Vector = Motor.vec(0, 0);
  private fondoSprite: Motor.Sprite | null = null;

  public paloColor?: CartaColor;
  public palo?: CartaPalo;
  public valor?: number;

  constructor(spriteIndex: number = 0,
              fondoIndex: number = 1,
              debug: boolean = true,
              palo?: CartaPalo,
              color?: CartaColor,
              valor?: number ) {
    super({
      name: 'Carta',
    });
    this.spriteIndex = spriteIndex;
    this.fondoIndex = fondoIndex;
    this.debug = debug;
    //const row = Math.floor(spriteIndex / 13);
    this.palo = palo;
    this.paloColor = color;
    this.valor = (spriteIndex % 13) + 1; // 1–13
  }

  override onInitialize(): void {
    this.originalPos = this.pos.clone();

    this.on('pointerdown', () => {
      if (!this.selected) {
        this.selected = true;
        if (this.fondoSprite) {
          this.fondoSprite.tint = Motor.Color.fromHex("#B15454B5");
        }
        this.actions.easeTo(this.originalPos.add(Motor.vec(0, -100)), 300, Motor.EasingFunctions.EaseInOutCubic);
      } else {
        this.selected = false;
        if (this.fondoSprite) {
          this.fondoSprite.tint = Motor.Color.Transparent;
        }
        this.actions.easeTo(this.originalPos, 300, Motor.EasingFunctions.EaseInOutCubic);
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
}
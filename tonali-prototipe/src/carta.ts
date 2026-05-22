import * as Motor from 'excalibur';
import { CartasSpriteSheet, FondosSpriteSheet } from './recursos';

export class Carta extends Motor.Actor {
  private spriteIndex: number;
  private fondoIndex: number;
  public debug: boolean;

  constructor(spriteIndex: number = 0, fondoIndex: number = 1, debug: boolean = false) {
    super({
      name: 'Carta',
    });
    this.spriteIndex = spriteIndex;
    this.fondoIndex = fondoIndex;
    this.debug = debug;
  }

  override onInitialize(): void {
    // Background sprite from FondosSpriteSheet
    const fondo = FondosSpriteSheet.getSprite(
      this.fondoIndex % 7,
      Math.floor(this.fondoIndex / 7)
    );

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
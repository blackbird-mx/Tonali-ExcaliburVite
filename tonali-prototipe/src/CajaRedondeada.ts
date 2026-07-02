import * as Motor from 'excalibur';

/**
 * Configuration options for CajaRedondeada
 */
export interface CajaRedondeadaOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  color?: Motor.Color;
  texto?: string;
  fontColor?: Motor.Color;
  fontSize?: number;
  fontFamily?: string;
}

/**
 * A custom Excalibur Actor that renders a rounded box and displays text centered over it.
 */
export class CajaRedondeada extends Motor.Actor {
  private customCanvas!: Motor.Canvas;
  private textoLabel: Motor.Label | null = null;
  private boxWidth: number;
  private boxHeight: number;
  private radius: number;
  private boxColor: Motor.Color;
  private texto: string;
  private fontColor: Motor.Color;
  private fontSize: number;
  private fontFamily: string;

  constructor(options: CajaRedondeadaOptions) {
    super({
      name: 'CajaRedondeada',
      pos: Motor.vec(options.x, options.y),
      width: options.width,
      height: options.height,
    });

    this.boxWidth = options.width;
    this.boxHeight = options.height;
    this.radius = options.radius ?? 10;
    this.boxColor = options.color ?? Motor.Color.fromHex('#444444');
    this.texto = options.texto ?? '';
    this.fontColor = options.fontColor ?? Motor.Color.Black;
    this.fontSize = options.fontSize ?? 18;
    this.fontFamily = options.fontFamily ?? 'sans-serif';
  }

  override onInitialize(engine: Motor.Engine): void {
    // Create canvas graphic for rounded rect
    this.customCanvas = new Motor.Canvas({
      width: this.boxWidth,
      height: this.boxHeight,
      draw: (ctx: CanvasRenderingContext2D) => {
        const w = this.boxWidth;
        const h = this.boxHeight;
        const r = Math.min(this.radius, w / 2, h / 2);

        ctx.fillStyle = this.boxColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();
      }
    });

    this.graphics.use(this.customCanvas);

    // If there is text, draw it centered over the box
    if (this.texto) {
      this.textoLabel = new Motor.Label({
        text: this.texto,
        pos: Motor.vec(0, 0),
        font: new Motor.Font({
          size: this.fontSize,
          color: this.fontColor,
          family: this.fontFamily,
          textAlign: Motor.TextAlign.Center,
          baseAlign: Motor.BaseAlign.Middle
        })
      });
      this.addChild(this.textoLabel);
    }
  }

  /**
   * Dynamically change the text drawn over the box.
   */
  public setTexto(texto: string): void {
    this.texto = texto;
    if (this.textoLabel) {
      this.textoLabel.text = texto;
    } else if (texto) {
      this.textoLabel = new Motor.Label({
        text: texto,
        pos: Motor.vec(0, 0),
        font: new Motor.Font({
          size: this.fontSize,
          color: this.fontColor,
          family: this.fontFamily,
          textAlign: Motor.TextAlign.Center,
          baseAlign: Motor.BaseAlign.Middle
        })
      });
      this.addChild(this.textoLabel);
    }
  }

  /**
   * Get the current text drawn over the box.
   */
  public getTexto(): string {
    return this.texto;
  }
}

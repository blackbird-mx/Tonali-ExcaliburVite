import * as Motor from 'excalibur';

export class NivelGameOver extends Motor.Scene {
  constructor() {
    super();
  }

  override onInitialize(engine: Motor.Engine): void {
    // Calculate the exact center of the engine viewport
    const centerX = engine.drawWidth / 2;
    const centerY = engine.drawHeight / 2;

    // Create the "GAME OVER" label centered in X and Y
    const labelGameOver = new Motor.Label({
      text: 'GAME OVER',
      pos: Motor.vec(centerX, centerY),
      font: new Motor.Font({
        family: 'GoNotoBold',
        size: 64,
        color: Motor.Color.fromHex('#ff3333'), // Vibrant red matching the retro/Balatro style
        textAlign: Motor.TextAlign.Center,     // Centers text horizontally at pos
        baseAlign: Motor.BaseAlign.Middle,     // Centers text vertically at pos
        bold: true,
      }),
    });

    // Add the label to the scene
    this.add(labelGameOver);
  }
}

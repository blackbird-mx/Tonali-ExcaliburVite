import { Actor, Color, Engine, Font, Label, Scene, vec } from 'excalibur';
import { Carta } from './carta';

export class BarajaCompleta extends Scene {
  override onInitialize(engine: Engine): void {
    const columns = 13;
    const rows = 4;
    const spriteWidth = 142;
    const spriteHeight = 190;
    const padding = 10;

    const totalWidth = columns * (spriteWidth + padding);
    const startX = (engine.drawWidth - totalWidth) / 2 + spriteWidth / 2;
    const startY = spriteHeight / 2 + padding;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        const carta = new Carta(index, 1, false);
        carta.pos = vec(
          startX + col * (spriteWidth + padding),
          startY + row * (spriteHeight + padding)
        );
        this.add(carta);
      }
    }

    // Back button
    const botonVolver = new Actor({
      name: 'BotonVolver',
      pos: vec(engine.drawWidth / 2, engine.drawHeight / 2),
      width: 150,
      height: 40,
      color: Color.fromHex('#553322'),
    });

    const label = new Label({
      text: 'Volver',
      pos: vec(0, 0),
      font: new Font({ size: 18, color: Color.White }),
    });
    botonVolver.addChild(label);

    botonVolver.on('pointerdown', () => {
      engine.goToScene('start');
    });

    this.add(botonVolver);
  }
}


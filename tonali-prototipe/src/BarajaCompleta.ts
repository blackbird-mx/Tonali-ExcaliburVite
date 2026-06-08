import {Actor, Color, Engine, Font, Label, Scene, vec} from 'excalibur';
import {Baraja} from './baraja';
import {CONFIG, IS_MOBILE} from './config';

export class BarajaCompleta extends Scene {
  private mobileColumns: number;

  constructor(mobileColumns: number = 5) {
    super();
    this.mobileColumns = mobileColumns;
  }

  override onInitialize(engine: Engine): void {
    const totalCards = 52;
    const spriteWidth = 47;
    const spriteHeight = 95;

    const scale = CONFIG.cardScale;
    const scaledWidth = spriteWidth * scale;
    const scaledHeight = spriteHeight * scale;
    const padding = IS_MOBILE ? 15 : 10;

    // Number of columns: configurable on mobile (default 4), 13 on desktop
    const columns = IS_MOBILE ? this.mobileColumns : 13;
    const rows = Math.ceil(totalCards / columns);

    const totalWidth = columns * (scaledWidth + padding);
    const totalHeight = rows * (scaledHeight + padding);

    // Center the grid within the engine viewport
    const startX = (engine.drawWidth - totalWidth) / 2; // + scaledWidth / 2 ;
    const startY = (engine.drawHeight - totalHeight - 50) / 2 + scaledHeight / 2;

    const baraja = new Baraja(vec(0, 0), 100, scale);
    const cartas = baraja.getMazoCompleto();

    for (let i = 0; i < totalCards; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const carta = cartas[i];

      carta.pos = vec(
        startX + col * (scaledWidth + padding),
        startY + row * (scaledHeight + padding)
      );

      this.add(carta);
    }

    // Back button
    const botonVolver = new Actor({
      name: 'BotonVolver',
      pos: vec(engine.drawWidth / 4, engine.drawHeight / 2),
      width: 150,
      height: 40,
      color: Color.fromHex('#553322'),
    });

    const label = new Label({
      text: 'Volver',
      pos: vec(0, 0),
      font: new Font({ size: IS_MOBILE ? 14 : 18, color: Color.White }),
    });
    botonVolver.addChild(label);

    botonVolver.on('pointerdown', () => {
      engine.goToScene('start');
    });

    this.add(botonVolver);
  }
}

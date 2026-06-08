import {Actor, Color, Engine, Font, Label, Scene, vec} from 'excalibur';
import {Baraja} from './baraja';
import {CONFIG} from './config';

export class NivelTodasLasCartas extends Scene {

  constructor() {
    super();
  }

  override onInitialize(engine: Engine): void {
    const totalCards = 52;
    const spriteWidth = 47;
    const spriteHeight = 95;

    const scale = CONFIG.cardScale;
    const scaledWidth = spriteWidth * scale;
    const scaledHeight = spriteHeight * scale;
    const paddingX = CONFIG.gallery.paddingX;
    const paddingY = CONFIG.gallery.paddingY;

    // Use responsive columns from config
    const columns = CONFIG.gallery.columns;
    const rows = Math.ceil(totalCards / columns);

    const totalWidth = columns * (scaledWidth + paddingX);
    const totalHeight = rows * (scaledHeight + paddingY);

    // Center the grid within the engine viewport
    const startX = (engine.drawWidth - totalWidth) / 2 + scaledWidth / 2;
    const startY = (engine.drawHeight - totalHeight - 50) / 2 + scaledHeight / 2;

    const baraja = new Baraja(vec(0, 0), 100, scale);
    const cartas = baraja.getMazoCompleto();

    for (let i = 0; i < totalCards; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const carta = cartas[i];

      carta.pos = vec(
        startX + col * (scaledWidth + paddingX),
        startY + row * (scaledHeight + paddingY)
      );

      // Disable selection for gallery view - cards are display-only
      carta.selectable = false;

      this.add(carta);
    }

    // Back button with responsive positioning
    const botonVolver = new Actor({
      name: 'BotonVolver',
      pos: vec(CONFIG.gallery.backButtonX, CONFIG.gallery.backButtonY),
      width: 150,
      height: 40,
      color: Color.fromHex('#553322'),
    });

    const label = new Label({
      text: 'Volver',
      pos: vec(0, 0),
      font: new Font({ size: CONFIG.fontSize.button, color: Color.White }),
    });
    botonVolver.addChild(label);

    botonVolver.on('pointerdown', () => {
      engine.goToScene('start');
    });

    this.add(botonVolver);
  }
}

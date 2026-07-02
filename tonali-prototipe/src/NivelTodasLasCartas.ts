import {Actor, Color, Engine, Font, Label, Scene, SceneActivationContext, vec, TextAlign, BaseAlign} from 'excalibur';
import {Baraja} from './baraja';
import {CONFIG} from './config';
import {Carta} from './carta';
import {Cuadricula} from './fondo';

export class NivelTodasLasCartas extends Scene {
  private cartasList: Carta[] = [];

  constructor() {
    super();
  }

  override onActivate(context: SceneActivationContext): void {
    super.onActivate(context);
    for (const carta of this.cartasList) {
      if (Carta.cartasUsadas.has(carta.spriteIndex)) {
        carta.tintarRojo();
      } else {
        carta.quitarTintarRojo();
      }
    }
  }

  override onInitialize(engine: Engine): void {
    const rejilla = new Cuadricula(5, 5, true);
    this.add(rejilla);

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
    this.cartasList = baraja.getMazoCompleto();

    for (let i = 0; i < totalCards; i++) {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const carta = this.cartasList[i];

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
      font: new Font({
        size: CONFIG.fontSize.button,
        color: Color.White,
        textAlign: TextAlign.Center,
        baseAlign: BaseAlign.Middle
      }),
    });
    botonVolver.addChild(label);

    botonVolver.on('pointerdown', () => {
      engine.goToScene('start');
    });

    this.add(botonVolver);
  }
}

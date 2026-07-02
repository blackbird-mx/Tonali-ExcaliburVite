import * as Motor from 'excalibur';
import { Carta } from './carta';
import { CartaColor } from './CartaColor';
import { CartaPalo } from './CartaPalo';

export class Baraja extends Motor.Actor {
  private cartas: Carta[] = [];
  private readonly mazoCompleto: Carta[];
  private cardSpacing: number = 150; // Default spacing, can be overridden
  private cardScale: number = 1.0;   // Default scale, can be overridden

  constructor(pos: Motor.Vector = Motor.vec(400, 500), cardSpacing: number = 150, cardScale: number = 1.0) {
    super({
      name: 'Baraja',
      pos,
    });
    this.cardSpacing = cardSpacing;
    this.cardScale = cardScale;
    this.mazoCompleto = this.inicializarMazoCompleto();
  }

  /**
   * Build and keep a full 52-card deck with palo/color/value metadata.
   */
  private inicializarMazoCompleto(): Carta[] {
    const mazo: Carta[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 13; col++) {
        const index = row * 13 + col;
        mazo.push(this.crearCartaDesdeIndice(index));
      }
    }
    console.log(mazo);
    return mazo;
  }

  private crearCartaDesdeIndice(index: number): Carta {
    const row = Math.floor(index / 13);
    const valorCarta = (index % 13) + 2;

    const paloPorFila: CartaPalo[] = [
      CartaPalo.Corazon,
      CartaPalo.Trebol,
      CartaPalo.Diamante,
      CartaPalo.Espada,
    ];
    const colorPorFila: CartaColor[] = [
      CartaColor.Rojo,
      CartaColor.Negro,
      CartaColor.Rojo,
      CartaColor.Negro,
    ];

    return new Carta(index, 1, false, paloPorFila[row], colorPorFila[row], valorCarta, this.cardScale);
  }

  /**
   * Return all cartas from the internally initialized full deck.
   */
  getMazoCompleto(): Carta[] {
    return this.mazoCompleto;
  }

  /**
   * Add a Carta to this Baraja and attach it as a child actor.
   */
  agregarCarta(carta: Carta): void {
    this.cartas.push(carta);
    this.addChild(carta);
    this.organizarCartas();
  }

  /**
   * Remove and return the top Carta (last added).
   */
  tomarCarta(): Carta | undefined {
    const carta = this.cartas.pop();
    if (carta) {
      this.removeChild(carta);
      this.organizarCartas();
    }
    return carta;
  }

  /**
   * Get the current number of cartas.
   */
  get cantidad(): number {
    return this.cartas.length;
  }

  /**
   * Spread cartas horizontally so they fan out from center.
   */
  private organizarCartas(): void {
    const separacion = this.cardSpacing;
    const totalWidth = (this.cartas.length - 1) * separacion;
    const startX = -totalWidth / 2;

    for (let i = 0; i < this.cartas.length; i++) {
      this.cartas[i].pos = Motor.vec(startX + i * separacion, -200);
    }
  }

  /**
   * Return all currently selected cartas in the hand.
   */
  getCartasSeleccionadas(): Carta[] {
    return this.cartas.filter(c => c.selected);
  }

  /**
   * Return all cartas currently in the hand.
   */
  getCartas(): Carta[] {
    return [...this.cartas];
  }

  /**
   * Remove selected cartas from the hand and replace them with new random cards.
   */
  descartarSeleccionadas(): void {
    const seleccionadas = this.cartas.filter(c => c.selected);
    for (const carta of seleccionadas) {
      const idx = this.cartas.indexOf(carta);
      if (idx !== -1) {
        Carta.cartasUsadas.add(carta.spriteIndex);
        this.cartas.splice(idx, 1);
        this.removeChild(carta);
        carta.kill();
      }
    }
    // Replace discarded cards
    const faltan = 5 - this.cartas.length;
    for (let i = 0; i < faltan; i++) {
      const randomIndex = Math.floor(Math.random() * 52);
      this.agregarCarta(this.crearCartaDesdeIndice(randomIndex));
    }
  }

  /**
   * Remove selected cartas from hand (after playing). Deals new cards to fill back to 5.
   */
  jugarSeleccionadas(): Carta[] {
    const seleccionadas = this.cartas.filter(c => c.selected);
    for (const carta of seleccionadas) {
      const idx = this.cartas.indexOf(carta);
      if (idx !== -1) {
        Carta.cartasUsadas.add(carta.spriteIndex);
        this.cartas.splice(idx, 1);
        this.removeChild(carta);
        carta.kill();
      }
    }
    // Replace played cards
    const faltan = 5 - this.cartas.length;
    for (let i = 0; i < faltan; i++) {
      const randomIndex = Math.floor(Math.random() * 52);
      this.agregarCarta(this.crearCartaDesdeIndice(randomIndex));
    }
    return seleccionadas;
  }

  /**
   * Remove all current cartas and deal a new random hand.
   */
  manoAleatoria(cantidad: number = 5): void {
    // Remove existing cards
    while (this.cartas.length > 0) {
      const carta = this.cartas.pop()!;
      this.removeChild(carta);
      carta.kill();
    }
    // Deal new random cards
    for (let i = 0; i < cantidad; i++) {
      const randomIndex = Math.floor(Math.random() * 52);
      this.agregarCarta(this.crearCartaDesdeIndice(randomIndex));
    }
  }
}

import * as Motor from 'excalibur';
import { Carta } from './carta';

export class Baraja extends Motor.Actor {
  private cartas: Carta[] = [];

  constructor(pos: Motor.Vector = Motor.vec(400, 500)) {
    super({
      name: 'Baraja',
      pos,
    });
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
    const separacion = 150;
    const totalWidth = (this.cartas.length - 1) * separacion;
    const startX = -totalWidth / 2;

    for (let i = 0; i < this.cartas.length; i++) {
      this.cartas[i].pos = Motor.vec(startX + i * separacion, -200);
    }
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
      this.agregarCarta(new Carta(randomIndex));
    }
  }
}

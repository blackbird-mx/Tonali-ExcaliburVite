import { Carta } from './carta';
import { CartaPalo } from './CartaPalo';

/**
 * Resultado de evaluar una mano de cartas.
 */
export interface ResultadoJugada {
  nombre: string;
  puntos: number;
  valida: boolean;
}

/**
 * Detecta jugadas válidas de poker en una mano de cartas seleccionadas.
 */
export class JugadasValidas {

  /**
   * Evalúa las cartas seleccionadas y retorna la mejor jugada encontrada.
   * Las cartas deben tener valor (2–14) y palo definidos.
   */
  static evaluar(cartas: Carta[]): ResultadoJugada {
    if (cartas.length === 0) {
      return { nombre: 'Sin selección', puntos: 0, valida: false };
    }

    if (cartas.length === 1) {
      return { nombre: 'Carta Alta', puntos: cartas[0].valor ?? 0, valida: true };
    }

    const valores = cartas.map(c => c.valor ?? 0).sort((a, b) => a - b);
    const palos = cartas.map(c => c.palo);

    // Check flush (all same suit)
    const esFlush = cartas.length >= 5 && palos.every(p => p === palos[0] && p !== CartaPalo.Nop);

    // Check straight (consecutive values)
    const esStraight = cartas.length >= 5 && this.esEscalera(valores);

    // Count value frequencies
    const frecuencias = this.contarFrecuencias(valores);
    const grupos = Object.values(frecuencias).sort((a, b) => b - a);

    // Royal Flush: straight flush with 10-J-Q-K-A (values 10,11,12,13,14)
    if (esFlush && esStraight && valores[0] === 10 && valores[valores.length - 1] === 14) {
      return { nombre: 'Escalera Real', puntos: 800, valida: true };
    }

    // Straight Flush
    if (esFlush && esStraight) {
      return { nombre: 'Escalera de Color', puntos: 400, valida: true };
    }

    // Four of a Kind
    if (grupos[0] === 4) {
      return { nombre: 'Póker (4 iguales)', puntos: 300, valida: true };
    }

    // Full House (three + pair)
    if (grupos[0] === 3 && grupos[1] === 2) {
      return { nombre: 'Full House', puntos: 250, valida: true };
    }

    // Flush
    if (esFlush) {
      return { nombre: 'Color (Flush)', puntos: 200, valida: true };
    }

    // Straight
    if (esStraight) {
      return { nombre: 'Escalera', puntos: 150, valida: true };
    }

    // Three of a Kind
    if (grupos[0] === 3) {
      return { nombre: 'Trío', puntos: 100, valida: true };
    }

    // Two Pair
    if (grupos[0] === 2 && grupos[1] === 2) {
      return { nombre: 'Doble Par', puntos: 50, valida: true };
    }

    // One Pair
    if (grupos[0] === 2) {
      return { nombre: 'Par', puntos: 30, valida: true };
    }

    // High Card (multiple cards but no combination)
    if (cartas.length >= 2) {
      return { nombre: 'Carta Alta', puntos: Math.max(...valores), valida: true };
    }

    return { nombre: 'Sin jugada', puntos: 0, valida: false };
  }

  /**
   * Checks if sorted values form a consecutive sequence.
   * Also handles Ace-low straight (A-2-3-4-5 as 14,2,3,4,5).
   */
  private static esEscalera(valores: number[]): boolean {
    if (valores.length < 5) return false;

    // Normal straight check
    let esConsecutiva = true;
    for (let i = 1; i < valores.length; i++) {
      if (valores[i] !== valores[i - 1] + 1) {
        esConsecutiva = false;
        break;
      }
    }
    if (esConsecutiva) return true;

    // Ace-low straight: A(14), 2, 3, 4, 5
    if (valores.length === 5 &&
        valores[0] === 2 && valores[1] === 3 && valores[2] === 4 &&
        valores[3] === 5 && valores[4] === 14) {
      return true;
    }

    return false;
  }

  /**
   * Count how many times each value appears.
   */
  private static contarFrecuencias(valores: number[]): Record<number, number> {
    const freq: Record<number, number> = {};
    for (const v of valores) {
      freq[v] = (freq[v] || 0) + 1;
    }
    return freq;
  }
}


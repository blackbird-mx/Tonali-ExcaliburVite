/**
 * @file card_character.ts
 * @description Clase CardCharacter que representa al personaje/mascota animado del tutorial (Jimbo).
 * Maneja la carta mostrada, partículas, botones de interacción y burbujas de diálogo.
 */

import { Card, CardCenter } from './card';

/** Argumentos de inicialización del personaje */
export interface CardCharacterArgs {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  center?: CardCenter;
}

/**
 * Clase CardCharacter: Personaje animado del juego (Jimbo).
 * Aparece durante el tutorial y otros momentos especiales. Presenta una carta de joker
 * con partículas decorativas, un botón de acción y una burbuja de diálogo.
 */
export class CardCharacter {
  /** Posición X */
  x: number;
  /** Posición Y */
  y: number;
  /** Ancho del área del personaje */
  w: number;
  /** Alto del área del personaje */
  h: number;
  /** Carta mostrada como avatar del personaje */
  card: Card | null;
  /** Configuración original */
  config: { args: CardCharacterArgs };
  /** Si el personaje está hablando */
  talking: boolean;
  /** Último sonido de voz reproducido */
  lastSaid: number;
  /** Botón de interacción actual */
  button: any;
  /** Burbuja de diálogo actual */
  speechBubble: any;

  /**
   * Crea una nueva instancia del personaje.
   * @param args - Argumentos de configuración (posición, tamaño, centro)
   */
  constructor(args: CardCharacterArgs = {}) {
    this.x = args.x || 1;
    this.y = args.y || 1;
    this.w = args.w || 2.0;
    this.h = args.h || 2.8;
    this.config = { args };
    this.talking = false;
    this.lastSaid = 0;
    this.button = null;
    this.speechBubble = null;

    // Crear la carta visual del personaje
    this.card = new Card(
      this.x, this.y,
      1.8, 2.4, // CARD_W, CARD_H from globals
      null,
      args.center || { name: 'Joker', pos: { x: 0, y: 0 }, set: 'Joker', config: { mult: 4 } } as CardCenter,
      { bypass_discovery_center: true }
    );
  }

  /**
   * Alinea la carta del personaje al centro del área.
   */
  align(): void {
    if (this.card) {
      this.card.x = this.x + (this.w - this.card.w) / 2;
      this.card.y = this.y + (this.h - this.card.h) / 2;
    }
  }

  /**
   * Añade un botón de acción debajo del personaje.
   * @param buttonText - Texto del botón
   * @param func - Función callback al presionar
   * @param colour - Color del botón
   * @param updateFunc - Función de actualización
   * @param snapTo - Si se debe enfocar automáticamente
   * @param yOffset - Desplazamiento vertical adicional
   */
  addButton(
    buttonText: string,
    func: string,
    colour?: any,
    updateFunc?: string,
    snapTo?: boolean,
    yOffset?: number
  ): void {
    this.removeButton();
    this.button = { text: buttonText, func, colour, updateFunc };
  }

  /**
   * Añade una burbuja de diálogo al personaje.
   * @param textKey - Clave del texto localizado a mostrar
   * @param align - Alineación de la burbuja ('bm', 'tm', etc.)
   * @param locVars - Variables de localización
   */
  addSpeechBubble(textKey: string, align?: string, locVars?: any): void {
    this.removeSpeechBubble();
    this.speechBubble = { textKey, align: align || 'bm', locVars, visible: false };
  }

  /**
   * Elimina el botón de acción actual.
   */
  removeButton(): void {
    this.button = null;
  }

  /**
   * Elimina la burbuja de diálogo actual.
   */
  removeSpeechBubble(): void {
    this.speechBubble = null;
  }

  /**
   * Inicia la secuencia de habla del personaje.
   * Reproduce sonidos de voz y anima la carta durante n "sílabas".
   * @param n - Número de sonidos/sílabas a reproducir
   * @param notFirst - Si no es la primera invocación (recursividad interna)
   */
  sayStuff(n: number, notFirst?: boolean): void {
    this.talking = true;

    if (!notFirst) {
      // Iniciar secuencia: hacer visible la burbuja y empezar a hablar
      if (this.speechBubble) {
        this.speechBubble.visible = true;
      }
      this.sayStuff(n, true);
    } else {
      if (n <= 0) {
        this.talking = false;
        return;
      }
      // Generar voz aleatoria
      let newSaid = Math.floor(Math.random() * 11) + 1;
      while (newSaid === this.lastSaid) {
        newSaid = Math.floor(Math.random() * 11) + 1;
      }
      this.lastSaid = newSaid;
      // En la implementación real se reproduciría play_sound('voice'+newSaid)
      // y se llamaría a card.juiceUp()
    }
  }

  /**
   * Dibuja el personaje y todos sus componentes visuales.
   */
  draw(): void {
    // Dibujar partículas, burbuja, botón y carta
  }

  /**
   * Elimina el personaje y todos sus hijos del juego.
   */
  remove(): void {
    this.card = null;
    this.button = null;
    this.speechBubble = null;
  }
}


/**
 * @file node.ts
 * @description Clase Node base para todos los objetos posicionables y con estados de interacción.
 */

import { GameObject } from './object';

/** Transformación geométrica de un nodo */
export interface Transform {
  x: number; y: number; w: number; h: number; r: number; scale: number;
}

/** Estados de interacción de un nodo */
export interface NodeStates {
  hover: { can: boolean; is: boolean };
  click: { can: boolean; is: boolean };
  drag: { can: boolean; is: boolean };
  collide: { can: boolean; is: boolean };
  focus: { can: boolean; is: boolean };
  visible: boolean;
}

/**
 * Clase Node: Elemento base posicionable con estados de interacción.
 */
export class Node extends GameObject {
  T: Transform;
  states: NodeStates;
  parent: Node | null = null;
  children: Record<string, any> = {};

  constructor(params?: { T?: Partial<Transform> }) {
    super();
    this.T = { x: 0, y: 0, w: 1, h: 1, r: 0, scale: 1, ...params?.T };
    this.states = {
      hover: { can: true, is: false },
      click: { can: true, is: false },
      drag: { can: true, is: false },
      collide: { can: true, is: false },
      focus: { can: true, is: false },
      visible: true,
    };
  }

  /** Maneja el evento hover */
  hover(): void { this.states.hover.is = true; }
  /** Termina el evento hover */
  stopHover(): void { this.states.hover.is = false; }
  /** Establece contenedor padre */
  setContainer(parent: Node): void { this.parent = parent; }
}


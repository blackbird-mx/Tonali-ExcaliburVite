/**
 * @file object.ts
 * @description Clase base Object que implementa herencia tipo Lua (extend/is).
 */

/** Clase base para todas las entidades del juego */
export class GameObject {
  /** Crea una subclase de esta clase */
  static extend<T extends typeof GameObject>(this: T): T {
    return class extends (this as any) {} as any;
  }

  /** Verifica si esta instancia es de un tipo dado */
  is(cls: any): boolean {
    return this instanceof cls;
  }
}


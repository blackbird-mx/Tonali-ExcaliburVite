/**
 * @file event.ts
 * @description Sistema de eventos y EventManager para secuenciar acciones del juego.
 */

/** Configuración de un evento */
export interface EventConfig {
  /** Función a ejecutar; retorna true cuando se completa */
  func: () => boolean;
  /** Disparador: 'after' espera delay, 'immediate' es instantáneo */
  trigger?: 'after' | 'immediate';
  /** Delay en segundos antes de ejecutar */
  delay?: number;
  /** Si el evento puede ser bloqueado por otros */
  blockable?: boolean;
  /** Si el evento bloquea a los siguientes */
  blocking?: boolean;
  /** Si no se debe borrar al completar */
  no_delete?: boolean;
  /** Temporizador a usar ('REAL' o default) */
  timer?: string;
  /** Si se ejecuta durante pausa */
  pause_force?: boolean;
}

/**
 * Clase Event: Representa una acción programada en el juego.
 */
export class Event {
  func: () => boolean;
  trigger: 'after' | 'immediate';
  delay: number;
  blockable: boolean;
  blocking: boolean;
  no_delete: boolean;
  timer: string;
  /** Tiempo transcurrido */
  elapsed: number = 0;
  /** Si el evento se completó */
  complete: boolean = false;

  constructor(config: EventConfig) {
    this.func = config.func;
    this.trigger = config.trigger || 'after';
    this.delay = config.delay || 0;
    this.blockable = config.blockable !== false;
    this.blocking = config.blocking !== false;
    this.no_delete = config.no_delete || false;
    this.timer = config.timer || 'default';
  }
}

/**
 * Clase EventManager: Gestiona una cola de eventos secuenciales.
 * Los eventos se ejecutan en orden; los bloqueantes detienen la cola hasta completarse.
 */
export class EventManager {
  private queues: Record<string, Event[]> = { default: [] };

  /** Añade un evento a una cola */
  add_event(event: Event, queue?: string): void {
    const q = queue || 'default';
    if (!this.queues[q]) this.queues[q] = [];
    this.queues[q].push(event);
  }

  /** Actualiza y ejecuta eventos en todas las colas */
  update(dt: number): void {
    for (const queueName in this.queues) {
      const queue = this.queues[queueName];
      if (queue.length === 0) continue;

      const event = queue[0];
      if (event.trigger === 'after') {
        event.elapsed += dt;
        if (event.elapsed >= event.delay) {
          event.complete = event.func();
        }
      } else {
        event.complete = event.func();
      }

      if (event.complete && !event.no_delete) {
        queue.shift();
      }
    }
  }

  /** Limpia todas las colas de eventos */
  clear_queue(queue?: string): void {
    if (queue) { this.queues[queue] = []; }
    else { this.queues = { default: [] }; }
  }
}


/**
 * @file controller.ts
 * @description Controlador de entrada: maneja mouse, teclado, gamepad y táctil.
 */

/** Flags de dispositivo de entrada humano */
export interface HIDFlags {
  mouse: boolean;
  controller: boolean;
  touch: boolean;
}

/**
 * Clase Controller: Gestiona toda la entrada del usuario y el foco de la UI.
 */
export class Controller {
  /** Dispositivo de entrada activo */
  HID: HIDFlags = { mouse: true, controller: false, touch: false };
  /** Cursor actual */
  cursor: { x: number; y: number } = { x: 0, y: 0 };
  /** Objeto siendo arrastrado */
  dragging: { target: any } = { target: null };
  /** Objeto con hover */
  hovering: { target: any } = { target: null };
  /** Objeto enfocado */
  focused: { target: any } = { target: null };
  /** Bloqueos de entrada */
  locks: Record<string | number, boolean> = {};
  /** Si la entrada está bloqueada */
  lock_input: boolean = false;
  /** Gamepad conectado */
  gamepad: any = null;
  /** Último toque */
  last_touch_time: number = -1;
  /** Si se usa touch en modo controlador */
  using_touch: boolean = false;
  /** Controlador de teclado virtual */
  keyboard_controller: any = {};

  /** Establece las flags del dispositivo de entrada */
  set_HID_flags(type: 'mouse' | 'touch' | 'button' | 'axis', button?: string): void {
    this.HID.mouse = type === 'mouse';
    this.HID.touch = type === 'touch';
    this.HID.controller = type === 'button' || type === 'axis';
  }

  /** Establece el gamepad activo */
  set_gamepad(joystick: any): void { this.gamepad = joystick; }

  /** Procesa pulsación de tecla */
  key_press(key: string): void { /* delegar */ }
  /** Procesa liberación de tecla */
  key_release(key: string): void { /* delegar */ }
  /** Procesa pulsación de botón */
  button_press(button: string): void { /* delegar */ }
  /** Procesa liberación de botón */
  button_release(button: string): void { /* delegar */ }

  /** Encola click izquierdo */
  queue_L_cursor_press(x: number, y: number): void { this.cursor = { x, y }; }
  /** Encola click derecho */
  queue_R_cursor_press(x: number, y: number): void { /* click derecho */ }
  /** Libera cursor izquierdo */
  L_cursor_release(x: number, y: number): void { this.dragging.target = null; }

  /** Enfoca un nodo específico */
  snap_to(config: { node: any }): void { this.focused.target = config.node; }
  /** Modifica la capa de contexto del cursor */
  mod_cursor_context_layer(delta: number): void { /* capas de foco */ }

  focus_cursor_stack: any[] = [];
  focus_cursor_stack_level: number = 1;
}


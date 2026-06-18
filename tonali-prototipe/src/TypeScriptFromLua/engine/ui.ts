/**
 * @file ui.ts
 * @description Sistema de UI (UIBox) basado en árboles de definición con filas/columnas.
 */
import { Moveable } from './moveable';

/** Nodo de definición de UI */
export interface UIDefinitionNode {
  n: number; // UIType (T, B, C, R, O, ROOT, S, I)
  config?: Record<string, any>;
  nodes?: UIDefinitionNode[];
}

/** Configuración de UIBox */
export interface UIBoxConfig {
  align?: string; offset?: { x: number; y: number }; major?: any; parent?: any; bond?: string;
}

/**
 * Clase UIBox: Contenedor de UI calculado a partir de un árbol de definición.
 */
export class UIBox extends Moveable {
  definition: UIDefinitionNode;
  config_ui: UIBoxConfig;

  constructor(params: { definition: UIDefinitionNode; config: UIBoxConfig }) {
    super(0, 0, 1, 1);
    this.definition = params.definition;
    this.config_ui = params.config;
  }

  /** Recalcula el layout del UIBox */
  recalculate(hard?: boolean): void { /* recálculo de dimensiones */ }
  /** Establece el rol/alineación */
  set_role(config: any): void { /* configurar alineación */ }
  /** Dibuja el UIBox */
  draw(): void { /* renderizado de UI */ }
}


import * as Motor from 'excalibur';

/**
 * Clase que dibuja una rejilla/cuadrícula que cubre todo el lienzo (canvas).
 * Permite parametrizar el número de filas y columnas, y alternar su visibilidad mediante un flag.
 */
export class Cuadricula extends Motor.Actor {
  private filas: number;
  private columnas: number;
  public mostrarRejilla: boolean = true;
  private colorLinea: Motor.Color;
  private grosorLinea: number;

  constructor(
    filas: number = 5,
    columnas: number = 5,
    mostrarRejilla: boolean = true,
    colorLinea: Motor.Color = Motor.Color.fromHex('#444444'),
    grosorLinea: number = 1
  ) {
    super({
      name: 'Cuadricula',
      pos: Motor.vec(0, 0),
      anchor: Motor.vec(0, 0),
      z: -100, // Renders behind cards and buttons by default
    });
    this.filas = filas;
    this.columnas = columnas;
    this.mostrarRejilla = mostrarRejilla;
    this.colorLinea = colorLinea;
    this.grosorLinea = grosorLinea;
  }

  /**
   * Cambia el número de filas de la cuadrícula.
   */
  public setFilas(filas: number): void {
    this.filas = filas;
  }

  /**
   * Obtiene el número actual de filas.
   */
  public getFilas(): number {
    return this.filas;
  }

  /**
   * Cambia el número de columnas de la cuadrícula.
   */
  public setColumnas(columnas: number): void {
    this.columnas = columnas;
  }

  /**
   * Obtiene el número actual de columnas.
   */
  public getColumnas(): number {
    return this.columnas;
  }

  /**
   * Configura si se debe mostrar u ocultar la rejilla.
   */
  public setMostrarRejilla(mostrar: boolean): void {
    this.mostrarRejilla = mostrar;
  }

  /**
   * Verifica si la rejilla está visible.
   */
  public getMostrarRejilla(): boolean {
    return this.mostrarRejilla;
  }

  override onInitialize(engine: Motor.Engine): void {
    this.graphics.onPostDraw = (ctx: Motor.ExcaliburGraphicsContext) => {
      if (!this.mostrarRejilla) return;

      const width = engine.drawWidth;
      const height = engine.drawHeight;

      const pasoX = width / this.columnas;
      const pasoY = height / this.filas;

      // Dibujar líneas verticales
      for (let i = 0; i <= this.columnas; i++) {
        const x = i * pasoX;
        ctx.drawLine(
          Motor.vec(x, 0),
          Motor.vec(x, height),
          this.colorLinea,
          this.grosorLinea
        );
      }

      // Dibujar líneas horizontales
      for (let i = 0; i <= this.filas; i++) {
        const y = i * pasoY;
        ctx.drawLine(
          Motor.vec(0, y),
          Motor.vec(width, y),
          this.colorLinea,
          this.grosorLinea
        );
      }

      // Dibujar texto con coordenadas x,y en cada intersección
      for (let col = 0; col <= this.columnas; col++) {
        for (let row = 0; row <= this.filas; row++) {
          const x = col * pasoX;
          const y = row * pasoY;
          const texto = `${Math.round(x)},${Math.round(y)}`;
          // Dibujar texto con un pequeño desfase para legibilidad
          ctx.debug.drawText(texto, Motor.vec(x + 4, y + 12));
        }
      }
    };
  }
}

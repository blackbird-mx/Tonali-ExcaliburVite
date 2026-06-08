import { Actor, Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { Baraja } from "./baraja";
import { JugadasValidas } from "./JugadasValidas";
import { CartaAnimacion } from "./CartaAnimacion";
import { Particulas } from "./Particulas";
import { CONFIG } from "./config";

export class NivelPrincipal
    extends Scene {
    private puntuacion: number = 0;
    private labelPuntuacion!: Label;
    private labelJugada!: Label;
    private baraja!: Baraja;
    private fuego!: Particulas;
    private fuegoTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Apply an animation to all current cards in the hand.
     */
    private animarCartas(tipo: CartaAnimacion): void {
        const cartas = this.baraja.getCartas();
        cartas.forEach((carta, i) => {
            carta.iniciarAnimacion(tipo, i);
        });
    }

    override onInitialize(engine: Engine): void {
        // Initialize baraja with responsive positioning and card scale
        this.baraja = new Baraja(
            vec(CONFIG.baraja.posX, CONFIG.baraja.posY),
            CONFIG.baraja.cardSpacing,
            CONFIG.cardScale
        );
        this.baraja.manoAleatoria(5);
        this.add(this.baraja);

        // Title "TONALI" using custom font
        const titulo = new Label({
            text: 'TONALI',
            pos: vec(engine.drawWidth / 2, CONFIG.layout.titleY),
            font: new Font({
                family: 'GoNotoBold',
                size: CONFIG.fontSize.title,
                color: Color.White,
                bold: true,
            }),
        });
        this.add(titulo);

        // Fire particle system (ambient, low intensity)
        this.fuego = new Particulas({
            pos: vec(engine.drawWidth / 4, engine.drawHeight - 200),
            emitRate: 50,
            maxParticulas: 1000,
            vida: 1200,
            vidaVariacion: 300,
            velocidad: 60,
            velocidadVariacion: 20,
            angulo: -Math.PI / 2,        // upward
            anguloDispersion: Math.PI / 6,
            gravedad: vec(0, -30),        // fire rises
            tamano: 8,
            tamanoFinal: 2,
            tamanoVariacion: 3,
            color: Color.fromHex('#FF6600'),
            colorFinal: Color.fromHex('#FF0000'),
            opacidad: 0.8,
            opacidadFinal: 0,
            forma: 'circle',
            friccion: 0.3,
        });
        this.add(this.fuego);
        this.fuego.emitir();

        // Apply smooth floating animation on initial deal
        // Delayed slightly so cards are positioned first
        setTimeout(() => this.animarCartas(CartaAnimacion.Flotar), 100);

        // Score label
        this.labelPuntuacion = new Label({
            text: 'Puntos: 0',
            pos: vec(120, CONFIG.layout.scoreY),
            font: new Font({ size: CONFIG.fontSize.label, color: Color.White }),
        });
        this.add(this.labelPuntuacion);

        // Hand result label
        this.labelJugada = new Label({
            text: '',
            pos: vec(CONFIG.layout.handResultX, CONFIG.layout.handResultY),
            font: new Font({ size: CONFIG.fontSize.label - 2, color: Color.Yellow }),
        });
        this.add(this.labelJugada);

        // Button "Jugar Mano"
        const btnBaseX = CONFIG.layout.buttonBaseX;
        const botonJugar = new Actor({
            name: 'BotonJugarMano',
            pos: vec(btnBaseX, CONFIG.layout.buttonsY),
            width: 180,
            height: CONFIG.buttonHeight,
            color: Color.fromHex('#224488'),
        });
        const labelJugar = new Label({
            text: 'Jugar Mano',
            pos: vec(0, 0),
            font: new Font({ size: CONFIG.fontSize.button, color: Color.White }),
        });
        botonJugar.addChild(labelJugar);

        botonJugar.on('pointerdown', () => {
            const seleccionadas = this.baraja.getCartasSeleccionadas();
            if (seleccionadas.length === 0) {
                this.labelJugada.text = 'Selecciona cartas!';
                return;
            }
            // Spin selected cards before removing
            seleccionadas.forEach((c, i) => c.iniciarAnimacion(CartaAnimacion.Girar, i));
            const resultado = JugadasValidas.evaluar(seleccionadas);
            if (resultado.valida) {
                this.puntuacion += resultado.puntos;
                this.labelPuntuacion.text = `Puntos: ${this.puntuacion}`;
                this.labelJugada.text = `${resultado.nombre} (+${resultado.puntos})`;
                // Intensify fire for 5 seconds on valid hand
                this.intensificarFuego();
            } else {
                this.labelJugada.text = resultado.nombre;
            }
            // Delay removal so spin is visible
            setTimeout(() => {
                this.baraja.jugarSeleccionadas();
                // New cards bounce in
                setTimeout(() => this.animarCartas(CartaAnimacion.Flotar), 100);
            }, 600);
        });
        this.add(botonJugar);

        // Button "Descartar"
        const botonDescartar = new Actor({
            name: 'BotonDescartar',
            pos: vec(btnBaseX + CONFIG.layout.buttonSpacing, CONFIG.layout.buttonsY),
            width: 180,
            height: CONFIG.buttonHeight,
            color: Color.fromHex('#882222'),
        });
        const labelDescartar = new Label({
            text: 'Descartar',
            pos: vec(0, 0),
            font: new Font({ size: CONFIG.fontSize.button, color: Color.White }),
        });
        botonDescartar.addChild(labelDescartar);

        botonDescartar.on('pointerdown', () => {
            const seleccionadas = this.baraja.getCartasSeleccionadas();
            if (seleccionadas.length === 0) {
                this.labelJugada.text = 'Selecciona cartas!';
                return;
            }
            this.labelJugada.text = `Descartadas: ${seleccionadas.length}`;
            this.baraja.descartarSeleccionadas();
            // New cards slide in from the left
            setTimeout(() => this.animarCartas(CartaAnimacion.Deslizar), 100);
        });
        this.add(botonDescartar);

        // Button "Mano Aleatoria"
        const boton = new Actor({
            name: 'BotonManoAleatoria',
            pos: vec(btnBaseX - CONFIG.layout.buttonSpacing, CONFIG.layout.buttonsY),
            width: 200,
            height: CONFIG.buttonHeight,
            color: Color.fromHex('#333333'),
        });
        const label = new Label({
            text: 'Mano Aleatoria',
            pos: vec(0, 0),
            font: new Font({ size: CONFIG.fontSize.button, color: Color.White }),
        });
        boton.addChild(label);
        boton.on('pointerdown', () => {
            this.baraja.manoAleatoria(5);
            this.labelJugada.text = '';
            // New hand bounces in from above
            setTimeout(() => this.animarCartas(CartaAnimacion.Rebotar), 100);
        });
        this.add(boton);

        // Button "Baraja Completa"
        const botonBaraja = new Actor({
            name: 'BotonBarajaCompleta',
            pos: vec(engine.drawWidth / 2, CONFIG.layout.titleY - 50),
            width: 200,
            height: CONFIG.buttonHeight,
            color: Color.fromHex('#225522'),
        });
        const labelBaraja = new Label({
            text: 'Baraja Completa',
            pos: vec(0, 0),
            font: new Font({ size: CONFIG.fontSize.button, color: Color.White }),
        });
        botonBaraja.addChild(labelBaraja);
        botonBaraja.on('pointerdown', () => {
            engine.goToScene('barajaCompleta');
        });
        this.add(botonBaraja);
    }

    override onPreLoad(loader: DefaultLoader): void {
        // Add any scene specific resources to load
    }

    override onActivate(context: SceneActivationContext<unknown>): void {
        // Called when Excalibur transitions to this scene
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
    }

    override onPreUpdate(engine: Engine, elapsedMs: number): void {
        // Called before anything updates in the scene
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        // Called after everything updates in the scene
    }

    override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called before Excalibur draws to the screen
    }

    override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
        // Called after Excalibur draws to the screen
    }

    /**
     * Boost fire particles intensity for 5 seconds, then return to normal.
     */
    private intensificarFuego(): void {
        // Clear previous timer if still active
        if (this.fuegoTimer) {
            clearTimeout(this.fuegoTimer);
        }

        // Remove the current low-intensity emitter and replace with intense one
        this.fuego.detener();
        this.fuego.limpiar();
        this.remove(this.fuego);

        const engine = this.engine;
        this.fuego = new Particulas({
            pos: vec(engine.drawWidth / 4, engine.drawHeight - 200),
            emitRate: 60,
            maxParticulas: 300,
            vida: 1500,
            vidaVariacion: 400,
            velocidad: 140,
            velocidadVariacion: 40,
            angulo: -Math.PI / 2,
            anguloDispersion: Math.PI / 3,
            gravedad: vec(0, -60),
            tamano: 12,
            tamanoFinal: 2,
            tamanoVariacion: 4,
            color: Color.fromHex('#FFCC00'),
            colorFinal: Color.fromHex('#FF2200'),
            opacidad: 1,
            opacidadFinal: 0,
            forma: 'circle',
            friccion: 0.2,
        });
        this.add(this.fuego);
        this.fuego.emitir();

        // After 5 seconds, return to normal fire
        this.fuegoTimer = setTimeout(() => {
            this.restaurarFuego();
            this.fuegoTimer = null;
        }, 5000);
    }

    /**
     * Restore fire to its normal ambient state.
     */
    private restaurarFuego(): void {
        this.fuego.detener();
        this.fuego.limpiar();
        this.remove(this.fuego);

        const engine = this.engine;
        this.fuego = new Particulas({
            pos: vec(engine.drawWidth / 4, engine.drawHeight - 200),
            emitRate: 8,
            maxParticulas: 100,
            vida: 1200,
            vidaVariacion: 300,
            velocidad: 60,
            velocidadVariacion: 20,
            angulo: -Math.PI / 2,
            anguloDispersion: Math.PI / 6,
            gravedad: vec(0, -30),
            tamano: 8,
            tamanoFinal: 2,
            tamanoVariacion: 3,
            color: Color.fromHex('#FF6600'),
            colorFinal: Color.fromHex('#FF0000'),
            opacidad: 0.8,
            opacidadFinal: 0,
            forma: 'circle',
            friccion: 0.3,
        });
        this.add(this.fuego);
        this.fuego.emitir();
    }
}
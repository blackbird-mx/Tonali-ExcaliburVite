import { Actor, Color, DefaultLoader, Engine, ExcaliburGraphicsContext, Font, Label, Scene, SceneActivationContext, vec } from "excalibur";
import { Carta } from "./carta";
import { Baraja } from "./baraja";

export class Nivel extends Scene {
    override onInitialize(engine: Engine): void {
        const baraja = new Baraja();
        for (let i = 0; i < 5; i++) {
            baraja.agregarCarta(new Carta(i));
        }
        this.add(baraja);

        // Button "Mano Aleatoria"
        const boton = new Actor({
            name: 'BotonManoAleatoria',
            pos: vec(400, 550),
            width: 200,
            height: 50,
            color: Color.fromHex('#333333'),
        });

        const label = new Label({
            text: 'Mano Aleatoria',
            pos: vec(0, 0),
            font: new Font({ size: 18, color: Color.White }),
        });
        boton.addChild(label);

        boton.on('pointerdown', () => {
            baraja.manoAleatoria(5);
        });

        this.add(boton);

        // Button "Baraja Completa"
        const botonBaraja = new Actor({
            name: 'BotonBarajaCompleta',
            pos: vec(400, 30),
            width: 200,
            height: 50,
            color: Color.fromHex('#225522'),
        });

        const labelBaraja = new Label({
            text: 'Baraja Completa',
            pos: vec(0, 0),
            font: new Font({ size: 18, color: Color.White }),
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
        // Only 1 scene is active at a time
    }

    override onDeactivate(context: SceneActivationContext): void {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
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
}
import {ImageSource, Loader, Sound, SpriteSheet} from "excalibur";

export const Recursos = {
    Sword: new ImageSource("./images/sword.png"),
    Cartas: new ImageSource("./images/8BitDeck.png"),
    Fondos: new ImageSource("./images/Enhancers.png"),
    MusicaFondo: new Sound("./sound/musicaFondo.ogg"),
    CartaClick: new Sound("./sound/card1.ogg")
} as const;

export const CartasSpriteSheet = SpriteSheet.fromImageSource({
    image: Recursos.Cartas,
    grid: {
        columns: 13,
        rows: 4,
        spriteWidth: 142,
        spriteHeight: 190,
    }
});

export const FondosSpriteSheet = SpriteSheet.fromImageSource({
    image: Recursos.Fondos,
    grid: {
        columns: 7,
        rows: 5,
        spriteWidth: 142,
        spriteHeight: 190,
    }
});

export const loader = new Loader();
for (const res of Object.values(Recursos)) {
    loader.addResource(res);
}

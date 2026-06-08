import { Color, Engine, FadeInOut } from "excalibur";
import { loader } from "./recursos";
import { NivelPrincipal } from "./nivelPrincipal";
import { NivelTodasLasCartas } from "./NivelTodasLasCartas";
import { Recursos } from "./recursos";
import { CONFIG, APP_MODE } from "./config";

// Goal is to keep main.ts small and just enough to configure the engine

const motor = new Engine({
  width: CONFIG.width,
  height: CONFIG.height,
  displayMode: CONFIG.displayMode,
  pixelArt: CONFIG.pixelArt,
  scenes: {
    start: NivelPrincipal,
    barajaCompleta: NivelTodasLasCartas
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

loader.addResource(Recursos.Cartas);

motor.start('start', {
  loader,
  inTransition: new FadeInOut({
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  console.log(`[Tonali] Engine started in ${APP_MODE} mode`);
});
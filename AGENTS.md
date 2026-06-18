# AGENTS.md

## Project Overview

Tonali is a **Balatro-inspired poker card game** built with **TypeScript**, **Excalibur.js v0.32**, and **Vite**. All source code lives under `tonali-prototipe/src/`. The codebase uses Spanish naming for domain concepts (cartas, baraja, palo, etc.) — preserve this convention in all new code.

## Architecture

- **`main.ts`** — Engine bootstrap only. Registers scenes (`start` → `NivelPrincipal`, `barajaCompleta` → `NivelTodasLasCartas`) and starts the loader. Keep minimal.
- **`config.ts`** — Responsive mobile/desktop mode system. `CONFIG` and `IS_MOBILE` are the main exports. Mode is detected via URL param `?mode=mobile`, `forceMode` constant, or auto-detection. All layout values (positions, font sizes, card scale) come from `ModeConfig`.
- **`nivelPrincipal.ts`** — Main gameplay scene (`NivelPrincipal` class extends `Scene`). Manages hand UI, score, buttons ("Jugar Mano", "Descartar", "Mano Aleatoria"), and fire particle effects. Buttons are raw `Actor`s with child `Label`s, not a UI framework. Implements Excalibur Scene lifecycle hooks: `onInitialize`, `onPreLoad`, `onActivate`, `onDeactivate`, `onPreUpdate`, `onPostUpdate`, `onPreDraw`, `onPostDraw`.
- **`NivelTodasLasCartas.ts`** — Gallery scene (`NivelTodasLasCartas` class extends `Scene`) showing all 52 cards in a grid. Navigated via `engine.goToScene('barajaCompleta')`. Cards are display-only with `selectable: false`.
- **`baraja.ts`** — Deck/hand manager. Holds a `Carta[]` hand, handles dealing (`manoAleatoria`), discarding, playing, and card fan layout (`organizarCartas`). Always refills to 5 cards.
- **`carta.ts`** — Card actor with sprite rendering, selection toggle (click moves card up), and animation system. Uses `GraphicsGroup` layering a background sprite (`FondosSpriteSheet`) under the card face (`CartasSpriteSheet`).
- **`JugadasValidas.ts`** — Pure logic: evaluates poker hands (pair through royal flush) from selected `Carta[]`. Stateless static methods — ideal for unit testing.
- **`Particulas.ts`** — Custom particle system (not Excalibur's built-in). Renders via `graphics.onPostDraw`. Configurable with `ParticulasConfig` interface.
- **`recursos.ts`** — Asset registry. `Recursos` maps image names, `CartasSpriteSheet` / `FondosSpriteSheet` define sprite grids (13×4 for cards at 142×190px). The `loader` auto-registers all resources.

## Key Enums (Spanish)

| Enum | Values | File |
|------|--------|------|
| `CartaPalo` | Corazon, Diamante, Trebol, Espada, Nop | `CartaPalo.ts` |
| `CartaColor` | Rojo, Negro, Nop | `CartaColor.ts` |
| `CartaAnimacion` | Flotar, Tambalear, Pulsar, Girar, Rebotar, Deslizar, Ninguna | `CartaAnimacion.ts` |

## Commands

All commands run from `tonali-prototipe/`:

```bash
npm run dev          # Vite dev server with --host (LAN accessible for mobile testing)
npm run build        # tsc && vite build (type-check then bundle)
npm test             # Build + Playwright visual regression tests
npm run test:integration-update  # Update Playwright snapshots
```

## Conventions & Patterns

- **Excalibur import alias**: Game engine is imported as `import * as Motor from 'excalibur'` in actor files. Use this alias consistently.
- **Spritesheet indexing**: Cards use `row * 13 + col` for a 13-column, 4-row grid. Row order: Corazon(0), Trebol(1), Diamante(2), Espada(3). Card values are `(index % 13) + 2` (2–14, where 14=Ace).
- **Scene navigation**: Use `engine.goToScene('sceneName')` with scene keys registered in `main.ts`.
- **Card selection**: Clicking a card toggles `selected`, moves it up 50px via eased action, and tints the background sprite. Animations pause while selected.
- **Layout responsiveness**: Never hardcode positions. Use `CONFIG.layout.*`, `CONFIG.baraja.*`, `CONFIG.fontSize.*`, and `CONFIG.cardScale` from `config.ts`.
- **Vite quirks**: `excalibur` is excluded from `optimizeDeps` (CommonJS compat). The `tiledPlugin` in `vite.config.js` prevents `.tsx` Tiled files from conflicting with React — don't remove it.
- **TypeScript**: Strict mode enabled, `noUnusedLocals: true`, `noUnusedParameters: false`. Target ESNext.
- **Empty files**: `UI.ts` and `fondo.ts` exist but are empty — reserved for future use.


/**
 * @file index.ts
 * @description Punto de reexportación central de todos los módulos del juego Balatro (TypeScript).
 */

// Configuración
export * from './conf';
export * from './globals';

// Clases principales del juego
export { Game, G } from './game';
export { Card } from './card';
export { CardArea } from './cardarea';
export { CardCharacter } from './card_character';
export { Back } from './back';
export { Blind } from './blind';
export { Tag } from './tag';
export { CHALLENGES } from './challenges';

// Motor (engine)
export { GameObject } from './engine/object';
export { Node } from './engine/node';
export { Moveable } from './engine/moveable';
export { Sprite } from './engine/sprite';
export { AnimatedSprite } from './engine/animatedsprite';
export { Event, EventManager } from './engine/event';
export { Controller } from './engine/controller';
export { Particles } from './engine/particles';
export { DynaText } from './engine/text';
export { UIBox } from './engine/ui';
export { STR_PACK, STR_UNPACK } from './engine/string_packer';
export { profileInitTable, setDiscoverTallies } from './engine/profile';

// Funciones
export * from './functions/misc_functions';
export * from './functions/common_events';
export * from './functions/button_callbacks';
export * from './functions/state_events';
export * from './functions/test_functions';
export * from './functions/UI_definitions';


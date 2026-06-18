/**
 * @file button_callbacks.ts
 * @description Callbacks de botones de la interfaz: jugar, descartar, comprar, vender, etc.
 */

/**
 * Verifica si se puede jugar la mano actual.
 * @returns true si hay cartas seleccionadas y manos disponibles
 */
export function canPlay(): boolean {
  // Verificar: cartas resaltadas, manos restantes > 0, estado correcto
  return true;
}

/**
 * Verifica si se puede descartar la selección actual.
 * @returns true si hay cartas seleccionadas y descartes disponibles
 */
export function canDiscard(): boolean {
  return true;
}

/**
 * Juega las cartas seleccionadas de la mano.
 */
export function playCardsFromHighlighted(): void {
  // Mover cartas resaltadas al área de juego y evaluar
}

/**
 * Descarta las cartas seleccionadas.
 */
export function discardCardsFromHighlighted(): void {
  // Mover cartas al descarte y dibujar nuevas
}

/**
 * Vuelve a generar los items de la tienda (reroll).
 */
export function rerollShop(): void {
  // Gastar dinero y regenerar shop_jokers
}

/**
 * Compra una carta de la tienda.
 * @param card - Referencia a la carta a comprar
 */
export function buyCard(card: any): void {
  // Verificar dinero, mover carta al área apropiada
}

/**
 * Vende una carta (joker o consumible).
 * @param card - Carta a vender
 */
export function sellCard(card: any): void {
  // Añadir dinero = sellCost, remover carta
}

/**
 * Salta el blind actual.
 */
export function skipBlind(): void {
  // Otorgar tag y avanzar al siguiente blind
}

/**
 * Selecciona un blind para jugarlo.
 * @param blindType - 'Small', 'Big' o 'Boss'
 */
export function selectBlind(blindType: string): void {
  // Activar el blind seleccionado e iniciar la ronda
}

/**
 * Muestra la información del mazo.
 */
export function deckInfo(): void {
  // Abrir overlay con contenido del mazo
}

/**
 * Aplica cambios de ventana/video.
 * @param immediate - Aplicar sin confirmación
 */
export function applyWindowChanges(immediate?: boolean): void {
  // Aplicar screenmode, resolución, vsync
}

/**
 * Navega al menú principal desde el juego.
 */
export function goToMainMenu(): void {
  // Guardar y volver al menú
}

/**
 * Inicia una nueva partida con el mazo seleccionado.
 */
export function startRun(): void {
  // Inicializar game object, aplicar efectos del mazo, ir al primer blind
}


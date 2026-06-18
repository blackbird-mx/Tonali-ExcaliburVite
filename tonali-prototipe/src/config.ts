import { DisplayMode } from "excalibur";

/**
 * Application mode: 'mobile' for phones/touch devices, 'desktop' for web browser.
 *
 * How to switch modes:
 * 1. URL parameter: ?mode=mobile or ?mode=desktop
 * 2. Automatic detection based on screen size and touch capability (fallback)
 * 3. Manual override by setting `forceMode` below
 */

// Set to 'mobile' or 'desktop' to force a mode, or null for auto-detection
const forceMode: 'mobile' | 'desktop' | null = null;

function detectMode(): 'mobile' | 'desktop' {
    // 1. Check URL parameter first
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    if (urlMode === 'mobile' || urlMode === 'desktop') {
        return urlMode;
    }

    // 2. Check manual override
    if (forceMode) {
        return forceMode;
    }

    // 3. Auto-detect based on device characteristics
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    if (isTouchDevice && isSmallScreen) {
        return 'mobile';
    }

    return 'desktop';
}

export const APP_MODE = detectMode();
export const IS_MOBILE = APP_MODE === 'mobile';

/**
 * Engine configuration type definition
 */
export interface ModeConfig {
    width: number;
    height: number;
    displayMode: DisplayMode;
    pixelArt: boolean;
    cardScale: number;
    buttonHeight: number;
    fontSize: {
        title: number;
        label: number;
        button: number;
        discardCounter: number;
    };
    layout: {
        titleY: number;
        scoreY: number;
        scoreX: number;
        discardCounterX: number;
        discardCounterY: number;
        handResultY: number;
        handResultX: number;
        buttonsY: number;
        buttonSpacing: number;
        buttonBaseX: number;
    };
    baraja: {
        posX: number;
        posY: number;
        cardSpacing: number;
    };
    gallery: {
        columns: number;
        paddingX: number;
        paddingY: number;
        backButtonX: number;
        backButtonY: number;
    };
}

/**
 * Engine configuration based on current mode
 */
export const ENGINE_CONFIG: Record<'mobile' | 'desktop', ModeConfig> = {
    mobile: {
        width: 480,
        height: 800,
        displayMode: DisplayMode.FitScreenAndFill,
        pixelArt: true,
        cardScale: 0.5,  // Smaller cards for mobile
        buttonHeight: 70,
        fontSize: {
            title: 36,
            label: 30,
            button: 22,
            discardCounter: 28,
        },
        layout: {
            titleY: 100,
            scoreY: 150,
            scoreX: 50,
            discardCounterX: 50,
            discardCounterY: 180,
            handResultY: 60,
            handResultX: 240,
            buttonsY: 720,
            buttonSpacing: 160,
            buttonBaseX: 240,
        },
        baraja: {
            posX: 240,
            posY: 500,
            cardSpacing: 90,
        },
        gallery: {
            columns: 6,
            paddingX: 55,
            paddingY: 20,
            backButtonX: 120,
            backButtonY: 50,
        }
    },
    desktop: {
        width: 800,
        height: 600,
        displayMode: DisplayMode.FitScreenAndFill,
        pixelArt: true,
        cardScale: 1.0,  // Normal size for desktop
        buttonHeight: 50,
        fontSize: {
            title: 48,
            label: 22,
            button: 18,
            discardCounter: 20,
        },
        layout: {
            titleY: 160,
            scoreY: 80,
            scoreX: 120,
            discardCounterX: 650,
            discardCounterY: 80,
            handResultY: 80,
            handResultX: 400,
            buttonsY: 550,
            buttonSpacing: 150,
            buttonBaseX: 300,
        },
        baraja: {
            posX: 400,
            posY: 350,
            cardSpacing: 150,
        },
        gallery: {
            columns: 13,
            paddingX: 10,
            paddingY: 10,
            backButtonX: 200,
            backButtonY: 30,
        }
    }
}

/** Current mode configuration shortcut */
export const CONFIG = ENGINE_CONFIG[APP_MODE] as ModeConfig;

console.log(`[Tonali] Running in ${APP_MODE} mode (${CONFIG.width}x${CONFIG.height})`);


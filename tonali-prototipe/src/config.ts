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
    };
    layout: {
        titleY: number;
        scoreY: number;
        handResultY: number;
        handResultX: number;
        buttonsY: number;
        buttonSpacing: number;
    };
    baraja: {
        posX: number;
        posY: number;
        cardSpacing: number;
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
        cardScale: 0.6,  // Smaller cards for mobile
        buttonHeight: 70,
        fontSize: {
            title: 36,
            label: 20,
            button: 22,
        },
        layout: {
            titleY: 100,
            scoreY: 60,
            handResultY: 60,
            handResultX: 240,
            buttonsY: 720,
            buttonSpacing: 160,
        },
        baraja: {
            posX: 240,
            posY: 500,
            cardSpacing: 90,
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
        },
        layout: {
            titleY: 160,
            scoreY: 80,
            handResultY: 80,
            handResultX: 400,
            buttonsY: 550,
            buttonSpacing: 150,
        },
        baraja: {
            posX: 400,
            posY: 350,
            cardSpacing: 150,
        }
    }
}

/** Current mode configuration shortcut */
export const CONFIG = ENGINE_CONFIG[APP_MODE] as ModeConfig;

console.log(`[Tonali] Running in ${APP_MODE} mode (${CONFIG.width}x${CONFIG.height})`);


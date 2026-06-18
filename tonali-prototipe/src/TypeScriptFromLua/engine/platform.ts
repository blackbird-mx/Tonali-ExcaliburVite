/**
 * @file platform.ts
 * @description Abstracción de plataforma (OS, rutas, clipboard).
 */
export interface Platform {
  getOS(): string;
  getPlatform?(): string;
  isOffline?(): boolean;
  hideSplashScreen?(): void;
  anyButtonPressed?(): boolean;
  isFirstTimePlaying?(): boolean;
  earlyInit?(): void;
  requestTrackingPermission?(): void;
}

export const platform: Platform = {
  getOS: () => 'Web',
};

/** @file save_manager.ts */
export interface SaveManager { save(data: any, filename: string): void; }

/** @file load_manager.ts */
export interface LoadManager { load(filename: string): any; }

/** @file sound_manager.ts */
export interface SoundManager { play(sound: string, pitch?: number, volume?: number): void; stop(): void; }

/** @file http_manager.ts */
export interface HTTPManager { request(url: string): void; }


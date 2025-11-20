/**
 * Type declarations for react-native-background-timer
 */

declare module 'react-native-background-timer' {
  export default class BackgroundTimer {
    static setInterval(callback: () => void, timeout: number): number;
    static clearInterval(id: number): void;
    static setTimeout(callback: () => void, timeout: number): number;
    static clearTimeout(id: number): void;
    static start(delay?: number): void;
    static stop(): void;
  }
}

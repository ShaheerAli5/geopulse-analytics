/**
 * Ambient React & JSX definitions to enable self-contained TypeScript verification
 * when node_modules/@types/react is not yet present on disk.
 */

declare namespace React {
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type KeyboardEvent = any;
  export function useState<T>(initial: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial?: T): { current: T };
}

declare module "react" {
  export = React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

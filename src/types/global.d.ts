// src/types/global.d.ts
export {};

declare global {
  interface Window {
    __enqueueSnackbarClose?: (key: string | number) => void;
  }
}

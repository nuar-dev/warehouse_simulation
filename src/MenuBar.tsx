// src/MenuBar.tsx
import { Window } from '@tauri-apps/api/window';
import React from "react";

export function MenuBar() {
  const minimize = () => {
    const currentWindow = Window.getCurrent();
    currentWindow.minimize();
  };

  const toggleMaximize = async () => {
    const currentWindow = Window.getCurrent();
    const isMaximized = await currentWindow.isMaximized();
    if (isMaximized) {
      currentWindow.unmaximize();
    } else {
      currentWindow.maximize();
    }
  };

  const close = () => {
    const currentWindow = Window.getCurrent();
    currentWindow.close();
  };

  return (
    <div className="menu-bar">
      <button onClick={minimize}>_</button>
      <button onClick={toggleMaximize}>[ ]</button>
      <button onClick={close}>X</button>
    </div>
  );
}
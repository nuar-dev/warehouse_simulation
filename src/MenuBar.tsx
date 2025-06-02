import { Window } from '@tauri-apps/api/window';

export function MenuBar() {
  const toggleFullscreen = async () => {
    const currentWindow = Window.getCurrent();
    const isFullscreen = await currentWindow.isFullscreen();
    if (isFullscreen) {
      await currentWindow.setFullscreen(false);
    } else {
      await currentWindow.setFullscreen(true);
    }
  };

  return (
    <div className="menu-bar">
      <button onClick={toggleFullscreen}>Toggle Fullscreen</button>
    </div>
  );
}

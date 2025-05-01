import { ipcRenderer } from "electron";
import type { UserSettings } from "../../main/src/services/user-settings-service.js";

export type ScreenshotSolution = {
  thoughts: string[];
  code: string;
  complexity: {
    time: string;
    space: string;
  };
};

export function onScreenshotSolution(
  callback: (data: ScreenshotSolution) => void
): () => void {
  const listener = (
    _event: Electron.IpcRendererEvent,
    data: ScreenshotSolution
  ) => {
    console.log("screenshot-solution", data);
    callback(data);
  };

  ipcRenderer.on("screenshot-solution", listener);

  return () => {
    ipcRenderer.removeListener("screenshot-solution", listener);
  };
}

export function onScreenshotProcessingStatus(
  callback: (processing: boolean) => void
): () => void {
  const listener = (_event: Electron.IpcRendererEvent, processing: boolean) => {
    callback(processing);
  };

  ipcRenderer.on("screenshot-processing-status", listener);

  return () => {
    ipcRenderer.removeListener("screenshot-processing-status", listener);
  };
}

export function getUserSettings(): Promise<UserSettings | null> {
  return ipcRenderer.invoke("get-user-settings") || null;
}

export function saveUserSettings(
  settings: Partial<UserSettings>
): Promise<void> {
  return ipcRenderer.invoke("save-user-settings", settings);
}

// Add function to close the window
// Add function to close the window
export function closeWindow(): void {
  ipcRenderer.invoke("close-window");
}

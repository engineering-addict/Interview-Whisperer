import type { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import { BrowserWindow, ipcMain } from "electron";
import type { AppInitConfig } from "../AppInitConfig.js";
import {
  UserSettings,
  userSettingsService,
} from "../services/user-settings-service.js";

class WindowManager implements AppModule {
  readonly #preload: { path: string };
  readonly #renderer: { path: string } | URL;
  readonly #openDevTools;
  #browserWindow: BrowserWindow | null = null;

  constructor({
    initConfig,
    openDevTools = false,
  }: {
    initConfig: AppInitConfig;
    openDevTools?: boolean;
  }) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
    this.#openDevTools = openDevTools;
  }

  async enable({ app }: ModuleContext): Promise<void> {
    await app.whenReady();
    await this.restoreOrCreateWindow(true);

    app.on("second-instance", () => this.restoreOrCreateWindow(true));
    app.on("activate", () => this.restoreOrCreateWindow(true));

    this.attachEventsListeners();
  }

  private attachEventsListeners() {
    ipcMain.handle("close-window", () => {
      this.#browserWindow?.hide();
    });

    ipcMain.handle("get-user-settings", () => {
      return userSettingsService.getSettings();
    });

    ipcMain.handle("save-user-settings", (_, settings: UserSettings) => {
      userSettingsService.saveSettings(settings);
    });
  }

  async createWindow(): Promise<BrowserWindow> {
    const browserWindow = new BrowserWindow({
      show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
      // width: 600,
      // height: 400,
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      hasShadow: false,
      type: "panel",
      resizable: true,
      // TODO: work around
      // focusable: false,
      skipTaskbar: true, // Hide from taskbar
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
        webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
        preload: this.#preload.path,
      },
    });

    this.#browserWindow = browserWindow;

    browserWindow.setAlwaysOnTop(true, "screen-saver");
    browserWindow.setContentProtection(true);
    browserWindow.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });

    if (this.#renderer instanceof URL) {
      await browserWindow.loadURL(this.#renderer.href);
    } else {
      await browserWindow.loadFile(this.#renderer.path);
    }

    return browserWindow;
  }

  async restoreOrCreateWindow(show = false) {
    let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

    if (window === undefined) {
      window = await this.createWindow();
    }

    if (!show) {
      return window;
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window?.show();

    if (this.#openDevTools) {
      window?.webContents.openDevTools();
    }

    window.focus();

    return window;
  }

  dispose() {
    this.#browserWindow?.destroy();
  }
}

export function createWindowManagerModule(
  ...args: ConstructorParameters<typeof WindowManager>
) {
  return new WindowManager(...args);
}

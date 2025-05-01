import { globalShortcut, screen, BrowserWindow } from "electron";
import { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";
import screenshot from "screenshot-desktop";
import { aiService } from "../services/ai-service.js";
import { ScreenshotSolution } from "@vite-electron-builder/preload";
import { userSettingsService } from "../services/user-settings-service.js";

class ShortcutsHandlersModule implements AppModule {
  private aiService = aiService;

  private TAKE_SCREENSHOT_SHORTCUT = "Command+H";
  private TOGGLE_WINDOW_SHORTCUT = "Command+B";

  async enable({ app }: ModuleContext): Promise<void> {
    await app.whenReady();

    this.init();
  }

  private async init(): Promise<void> {
    this.registerGlobalShortcuts();
  }

  private _window: BrowserWindow | null = null;

  private getCurrentWindow(): BrowserWindow | null {
    if (!this._window) {
      this._window =
        BrowserWindow.getAllWindows().find((w) => !w.isDestroyed()) || null;
    }

    return this._window;
  }

  // Start a pulsing animation
  private getScreenWithMouse() {
    const point = screen.getCursorScreenPoint();
    const displays = screen.getAllDisplays();

    const targetDisplay =
      displays.find((display) => {
        const bounds = display.bounds;

        return (
          point.x >= bounds.x &&
          point.x <= bounds.x + bounds.width &&
          point.y >= bounds.y &&
          point.y <= bounds.y + bounds.height
        );
      }) || screen.getPrimaryDisplay();

    // Find the index of the display in the array
    return displays.findIndex((d) => d.id === targetDisplay.id);
  }

  private async captureScreenshot(): Promise<Buffer> {
    const screenIndex = this.getScreenWithMouse();

    return await screenshot({
      screen: screenIndex,
    });
  }

  private async hideWindow(): Promise<void> {
    const window = this.getCurrentWindow();

    // Hide the window before taking a screenshot
    if (window && window.isVisible()) {
      window.hide();

      // Give a small delay to ensure the window is hidden
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  private showWindow(): void {
    const window = this.getCurrentWindow();

    if (window) {
      window.show();
      window.setAlwaysOnTop(true, "screen-saver");
      window.moveTop();
    }
  }

  private notifyScreenshotSolution(solution: ScreenshotSolution): void {
    const window = this.getCurrentWindow();

    window?.webContents.send("screenshot-solution", solution);
  }

  private notifyProcessingStatus(processing: boolean): void {
    const window = this.getCurrentWindow();

    window?.webContents.send("screenshot-processing-status", processing);
  }

  // TODO: AbortController
  // TODO: allow to specify preferred language on UI.
  // TODO: allow to control opacity of the window
  private async handleScreenshotShortcut(): Promise<void> {
    try {
      this.notifyProcessingStatus(true);

      console.log("[handle-screenshot-shortcut] hiding window");
      await this.hideWindow();

      console.log("[handle-screenshot-shortcut] capturing screenshot");
      const screenshot = await this.captureScreenshot();

      console.log("[handle-screenshot-shortcut] showing window");
      this.showWindow();

      console.log("[handle-screenshot-shortcut] getting solution");

      const settings = userSettingsService.getSettings();

      if (!settings) {
        console.error("[handle-screenshot-shortcut] no settings found");
        throw new Error("No settings found");
      }

      const solution = await this.aiService.getSolutionFromScreenshot(
        screenshot,
        settings.language,
        settings.apiKey
      );

      console.log("[handle-screenshot-shortcut] notifying solution");

      this.notifyScreenshotSolution(solution);
    } catch (error) {
      console.error("[handle-screenshot-shortcut] error:", error);

      this.showWindow();
    } finally {
      this.notifyProcessingStatus(false);
    }
  }

  // sucks to have this stuff here
  private handleCloseWindowShortcut(): void {
    const window = this.getCurrentWindow();

    if (!window) {
      return;
    }

    if (window.isVisible()) {
      this.hideWindow();
    } else {
      this.showWindow();
    }
  }

  private registerGlobalShortcuts(): void {
    globalShortcut.register(this.TAKE_SCREENSHOT_SHORTCUT, () =>
      this.handleScreenshotShortcut()
    );

    // Add shortcut to close/hide the window
    globalShortcut.register(this.TOGGLE_WINDOW_SHORTCUT, () =>
      this.handleCloseWindowShortcut()
    );
  }

  dispose(): void {
    globalShortcut.unregister(this.TAKE_SCREENSHOT_SHORTCUT);
    globalShortcut.unregister(this.TOGGLE_WINDOW_SHORTCUT);
  }
}

export function shortcutsHandlersModule(
  ...args: ConstructorParameters<typeof ShortcutsHandlersModule>
) {
  return new ShortcutsHandlersModule(...args);
}

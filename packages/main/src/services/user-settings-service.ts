import Store from "electron-store";

export type UserSettings = {
  language: string;
  apiKey: string;
  windowOpacity: number;
};

class UserSettingsService {
  private store: Store<UserSettings>;

  constructor() {
    this.store = new Store<UserSettings>({
      name: "user-settings-v6",
    });
  }

  getSettings(): UserSettings | null {
    try {
      const settings = this.store.get("settings") as UserSettings | null;

      return settings || null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  }

  saveSettings(settings: Partial<UserSettings>): void {
    try {
      const currentSettings = this.getSettings();

      this.store.set("settings", { ...currentSettings, ...settings });
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }
}

export const userSettingsService = new UserSettingsService();

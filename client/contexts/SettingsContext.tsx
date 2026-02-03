import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import type { AppSettings, SupportedLanguage } from "@/types";
import { StorageService } from "@/services/storage";

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings>({
    language: "en",
    displayCurrency: "USD",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      setSettings(savedSettings);
      await i18n.changeLanguage(savedSettings.language);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await StorageService.setSettings({ language: lang });
      await i18n.changeLanguage(lang);
      setSettings((prev) => ({ ...prev, language: lang }));
    },
    [i18n],
  );

  const setCurrency = useCallback(async (currency: string) => {
    await StorageService.setSettings({ displayCurrency: currency });
    setSettings((prev) => ({ ...prev, displayCurrency: currency }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        setLanguage,
        setCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

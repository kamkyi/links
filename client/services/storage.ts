import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, Profile, AppSettings, SupportedLanguage } from "@/types";

const STORAGE_KEYS = {
  USER: "@link_user",
  PROFILE: "@link_profile",
  SETTINGS: "@link_settings",
  PROFILES: "@link_all_profiles",
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  displayCurrency: "USD",
};

export const StorageService = {
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.PROFILE);
  },

  async getProfile(): Promise<Profile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setProfile(profile: Profile): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    const allProfiles = await this.getAllProfiles();
    const existingIndex = allProfiles.findIndex((p) => p.uid === profile.uid);
    if (existingIndex >= 0) {
      allProfiles[existingIndex] = profile;
    } else {
      allProfiles.push(profile);
    }
    await AsyncStorage.setItem(
      STORAGE_KEYS.PROFILES,
      JSON.stringify(allProfiles),
    );
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async setSettings(settings: Partial<AppSettings>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  },

  async getAllProfiles(): Promise<Profile[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async seedProfiles(): Promise<void> {
    const existing = await this.getAllProfiles();
    if (existing.length > 0) return;

    const seedProfiles: Profile[] = [
      {
        uid: "seed-1",
        professionalType: "Doctor",
        phoneNumber: "+66 812 345 678",
        address: "123 Medical Center, Bangkok",
        description:
          "Experienced general practitioner with 15 years of practice. Specializing in family medicine and preventive care.",
        wageType: "hourly",
        wageAmount: 2000,
        currency: "THB",
        images: [],
        languages: ["en", "th"],
        isPublished: true,
        displayName: "Dr. Somchai Prasert",
      },
      {
        uid: "seed-2",
        professionalType: "Translator",
        phoneNumber: "+66 891 234 567",
        address: "45 Language Hub, Chiang Mai",
        description:
          "Professional translator specializing in Thai, English, and Burmese. Legal and medical document translation available.",
        wageType: "hourly",
        wageAmount: 800,
        currency: "THB",
        images: [],
        languages: ["en", "th", "my"],
        isPublished: true,
        displayName: "Nong Phetcharat",
      },
      {
        uid: "seed-3",
        professionalType: "Plumber",
        phoneNumber: "+66 823 456 789",
        address: "78 Service Road, Phuket",
        description:
          "Licensed plumber with expertise in residential and commercial plumbing. 24/7 emergency service available.",
        wageType: "daily",
        wageAmount: 1500,
        currency: "THB",
        images: [],
        languages: ["th"],
        isPublished: true,
        displayName: "Prasit Wongsawat",
      },
      {
        uid: "seed-4",
        professionalType: "TourGuide",
        phoneNumber: "+66 834 567 890",
        address: "12 Tourism Street, Bangkok",
        description:
          "Certified tour guide with extensive knowledge of Thai history and culture. Private and group tours available.",
        wageType: "daily",
        wageAmount: 3000,
        currency: "THB",
        images: [],
        languages: ["en", "th"],
        isPublished: true,
        displayName: "Apinya Thongchai",
      },
      {
        uid: "seed-5",
        professionalType: "Driver",
        phoneNumber: "+66 845 678 901",
        address: "Bangkok Metropolitan Area",
        description:
          "Professional driver with comfortable sedan. Airport transfers, city tours, and long-distance travel.",
        wageType: "daily",
        wageAmount: 2500,
        currency: "THB",
        images: [],
        languages: ["en", "th"],
        isPublished: true,
        displayName: "Kittipong Srisuk",
      },
      {
        uid: "seed-6",
        professionalType: "Shop",
        phoneNumber: "+66 856 789 012",
        address: "234 Market Street, Bangkok",
        description:
          "Local handicraft shop featuring authentic Thai souvenirs and handmade goods. Wholesale available.",
        wageType: "hourly",
        wageAmount: 0,
        currency: "THB",
        images: [],
        languages: ["en", "th"],
        isPublished: true,
        displayName: "Thai Treasures Shop",
      },
      {
        uid: "seed-7",
        professionalType: "Delivery",
        phoneNumber: "+66 867 890 123",
        address: "All Bangkok Areas",
        description:
          "Fast and reliable delivery service. Same-day delivery for packages up to 50kg. Motorcycle and van available.",
        wageType: "hourly",
        wageAmount: 200,
        currency: "THB",
        images: [],
        languages: ["th"],
        isPublished: true,
        displayName: "Wichai Express",
      },
      {
        uid: "seed-8",
        professionalType: "Other",
        otherTypeLabel: "Personal Trainer",
        phoneNumber: "+66 878 901 234",
        address: "Fitness Center, Sukhumvit",
        description:
          "Certified personal trainer specializing in weight loss and muscle building. In-home training available.",
        wageType: "hourly",
        wageAmount: 1000,
        currency: "THB",
        images: [],
        languages: ["en", "th"],
        isPublished: true,
        displayName: "Mike Fitness",
      },
    ];

    await AsyncStorage.setItem(
      STORAGE_KEYS.PROFILES,
      JSON.stringify(seedProfiles),
    );
  },
};

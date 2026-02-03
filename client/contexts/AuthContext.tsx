import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, Profile } from "@/types";
import { StorageService } from "@/services/storage";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      await StorageService.seedProfiles();
      const savedUser = await StorageService.getUser();
      const savedProfile = await StorageService.getProfile();
      setUser(savedUser);
      setProfile(savedProfile);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async () => {
    const mockUser: User = {
      uid: `user-${Date.now()}`,
      displayName: "Demo User",
      email: "demo@link.app",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await StorageService.setUser(mockUser);
    setUser(mockUser);
  }, []);

  const signOut = useCallback(async () => {
    await StorageService.clearUser();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const savedProfile = await StorageService.getProfile();
    setProfile(savedProfile);
  }, []);

  const updateProfile = useCallback(
    async (newProfile: Profile) => {
      await StorageService.setProfile(newProfile);
      setProfile(newProfile);
      if (user) {
        const updatedUser: User = {
          ...user,
          role: "professional",
          updatedAt: new Date().toISOString(),
        };
        await StorageService.setUser(updatedUser);
        setUser(updatedUser);
      }
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

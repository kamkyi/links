import React, { useState } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CURRENCIES } from "@/utils/currency";
import type { SupportedLanguage } from "@/types";

const LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: "en", name: "English" },
  { code: "th", name: "ไทย (Thai)" },
  { code: "my", name: "မြန်မာ (Burmese)" },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, signOut } = useAuth();
  const { settings, setLanguage, setCurrency } = useSettings();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await signOut();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    await setLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCurrencyChange = async (currency: string) => {
    await setCurrency(currency);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Animated.View entering={FadeInUp.delay(0).springify()}>
        <View style={styles.section}>
          <ThemedText
            type="small"
            style={[styles.sectionTitle, { color: theme.textSecondary }]}
          >
            {t("settings.language")}
          </ThemedText>
          <View
            style={[styles.optionGroup, { backgroundColor: theme.cardBackground }]}
          >
            {LANGUAGES.map((lang, index) => (
              <Pressable
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                style={[
                  styles.optionRow,
                  index < LANGUAGES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <ThemedText type="body">{lang.name}</ThemedText>
                {settings.language === lang.code ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(50).springify()}>
        <View style={styles.section}>
          <ThemedText
            type="small"
            style={[styles.sectionTitle, { color: theme.textSecondary }]}
          >
            {t("settings.currency")}
          </ThemedText>
          <View
            style={[styles.optionGroup, { backgroundColor: theme.cardBackground }]}
          >
            {CURRENCIES.slice(0, 4).map((curr, index) => (
              <Pressable
                key={curr.code}
                onPress={() => handleCurrencyChange(curr.code)}
                style={[
                  styles.optionRow,
                  index < 3 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View>
                  <ThemedText type="body">{curr.name}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {curr.symbol} {curr.code}
                  </ThemedText>
                </View>
                {settings.displayCurrency === curr.code ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      {isAuthenticated ? (
        <Animated.View entering={FadeInUp.delay(100).springify()}>
          <View style={styles.section}>
            <Pressable
              onPress={() => setShowLogoutModal(true)}
              style={[
                styles.logoutButton,
                { backgroundColor: theme.error + "15" },
              ]}
            >
              <Feather name="log-out" size={20} color={theme.error} />
              <ThemedText
                type="body"
                style={[styles.logoutText, { color: theme.error }]}
              >
                {t("settings.logout")}
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}
          >
            <ThemedText type="h4" style={styles.modalTitle}>
              {t("settings.logout")}
            </ThemedText>
            <ThemedText
              type="body"
              style={[styles.modalMessage, { color: theme.textSecondary }]}
            >
              {t("settings.logoutConfirm")}
            </ThemedText>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                style={[
                  styles.modalButton,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {t("settings.cancel")}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={handleLogout}
                style={[styles.modalButton, { backgroundColor: theme.error }]}
              >
                <ThemedText
                  type="body"
                  style={{ color: "#FFFFFF", fontWeight: "600" }}
                >
                  {t("settings.confirm")}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  optionGroup: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  logoutText: {
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
});

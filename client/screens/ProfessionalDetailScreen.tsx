import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { formatCurrency } from "@/utils/currency";
import { StorageService } from "@/services/storage";
import type { Profile } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type DetailRouteProp = RouteProp<RootStackParamList, "ProfessionalDetail">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProfessionalDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<DetailRouteProp>();
  const { isAuthenticated, signIn } = useAuth();

  const { uid } = route.params;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [uid]);

  const loadProfile = async () => {
    try {
      const allProfiles = await StorageService.getAllProfiles();
      const found = allProfiles.find((p) => p.uid === uid);
      setProfile(found || null);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = async () => {
    if (!profile) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const phoneUrl = `tel:${profile.phoneNumber.replace(/\s/g, "")}`;
    try {
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.error("Failed to open phone:", error);
    }
  };

  const handleSignIn = async () => {
    await signIn();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <LoadingSpinner />
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <EmptyState
          title={t("common.error")}
          description="Profile not found"
          actionLabel={t("common.back")}
        />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.authGateContainer,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
          },
        ]}
      >
        <Animated.View
          entering={FadeInUp.springify()}
          style={[styles.authGateCard, { backgroundColor: theme.cardBackground }]}
        >
          <Image
            source={require("../../assets/images/locked-contact.png")}
            style={styles.authGateImage}
            resizeMode="contain"
          />
          <ThemedText type="h3" style={styles.authGateTitle}>
            {t("authGate.title")}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.authGateDescription, { color: theme.textSecondary }]}
          >
            {t("authGate.description")}
          </ThemedText>
          <Button onPress={handleSignIn} style={styles.authGateButton}>
            {t("authGate.button")}
          </Button>
        </Animated.View>
      </View>
    );
  }

  const displayType =
    profile.professionalType === "Other"
      ? profile.otherTypeLabel || t("professionalTypes.Other")
      : t(`professionalTypes.${profile.professionalType}`);

  const wageLabel =
    profile.wageType === "hourly"
      ? t("results.perHour")
      : t("results.perDay");

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + 80 + Spacing.xl,
          },
        ]}
      >
        <Animated.View
          entering={FadeInUp.delay(0).springify()}
          style={styles.header}
        >
          <Image
            source={require("../../assets/images/avatar-placeholder.png")}
            style={styles.avatar}
          />
          <ThemedText type="h1" style={styles.name}>
            {profile.displayName}
          </ThemedText>
          <View
            style={[styles.typeBadge, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText
              type="body"
              style={[styles.typeText, { color: theme.primary }]}
            >
              {displayType}
            </ThemedText>
          </View>
        </Animated.View>

        {profile.wageAmount > 0 ? (
          <Animated.View
            entering={FadeInUp.delay(50).springify()}
            style={[styles.wageCard, { backgroundColor: theme.cardBackground }]}
          >
            <ThemedText
              type="small"
              style={[styles.wageLabel, { color: theme.textSecondary }]}
            >
              {t("detail.wage")}
            </ThemedText>
            <View style={styles.wageRow}>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {formatCurrency(profile.wageAmount, profile.currency)}
              </ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {wageLabel}
              </ThemedText>
            </View>
          </Animated.View>
        ) : null}

        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={[styles.section, { backgroundColor: theme.cardBackground }]}
        >
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color={theme.primary} />
            <View style={styles.infoContent}>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                {t("detail.phone")}
              </ThemedText>
              <ThemedText type="body">{profile.phoneNumber}</ThemedText>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color={theme.primary} />
            <View style={styles.infoContent}>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                {t("detail.address")}
              </ThemedText>
              <ThemedText type="body">{profile.address}</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(150).springify()}
          style={styles.descriptionSection}
        >
          <ThemedText type="body">{profile.description}</ThemedText>
        </Animated.View>

        {profile.languages.length > 0 ? (
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={styles.languagesSection}
          >
            <ThemedText
              type="small"
              style={[styles.sectionLabel, { color: theme.textSecondary }]}
            >
              {t("detail.languages")}
            </ThemedText>
            <View style={styles.languageChips}>
              {profile.languages.map((lang) => (
                <View
                  key={lang}
                  style={[
                    styles.languageChip,
                    { backgroundColor: theme.backgroundSecondary },
                  ]}
                >
                  <ThemedText type="small">
                    {t(`languages.${lang}`)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(250).springify()}
        style={[
          styles.floatingButton,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <ContactButton onPress={handleContact} theme={theme} />
      </Animated.View>
    </View>
  );
}

function ContactButton({
  onPress,
  theme,
}: {
  onPress: () => void;
  theme: any;
}) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.contactButton,
        { backgroundColor: theme.accent },
        animatedStyle,
      ]}
    >
      <Feather
        name="phone"
        size={20}
        color="#FFFFFF"
        style={styles.contactIcon}
      />
      <ThemedText type="body" style={styles.contactText}>
        {t("detail.contact")}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.lg,
  },
  name: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  typeText: {
    fontWeight: "600",
  },
  wageCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  wageLabel: {
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  wageRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  section: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  descriptionSection: {
    marginBottom: Spacing.lg,
  },
  languagesSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  languageChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  languageChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  floatingButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  contactIcon: {
    marginRight: Spacing.sm,
  },
  contactText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  authGateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  authGateCard: {
    width: "100%",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.xl,
    alignItems: "center",
  },
  authGateImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
  },
  authGateTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  authGateDescription: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  authGateButton: {
    width: "100%",
  },
});

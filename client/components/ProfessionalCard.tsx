import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { formatCurrency } from "@/utils/currency";
import type { Profile } from "@/types";
import { useTranslation } from "react-i18next";

interface ProfessionalCardProps {
  profile: Profile;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProfessionalCard({ profile, onPress }: ProfessionalCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const displayType =
    profile.professionalType === "Other"
      ? profile.otherTypeLabel || t("professionalTypes.Other")
      : t(`professionalTypes.${profile.professionalType}`);

  const wageLabel =
    profile.wageType === "hourly"
      ? t("results.perHour")
      : t("results.perDay");

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground },
        animatedStyle,
      ]}
    >
      <Image
        source={require("../../assets/images/avatar-placeholder.png")}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <ThemedText type="h4" numberOfLines={1} style={styles.name}>
          {profile.displayName}
        </ThemedText>
        <View style={styles.typeRow}>
          <View
            style={[styles.typeBadge, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText
              type="small"
              style={[styles.typeText, { color: theme.primary }]}
            >
              {displayType}
            </ThemedText>
          </View>
        </View>
        <ThemedText
          type="small"
          numberOfLines={2}
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {profile.description}
        </ThemedText>
        {profile.wageAmount > 0 ? (
          <View style={styles.wageRow}>
            <ThemedText type="body" style={[styles.wage, { color: theme.primary }]}>
              {formatCurrency(profile.wageAmount, profile.currency)}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary }}
            >
              {wageLabel}
            </ThemedText>
          </View>
        ) : null}
      </View>
      <Feather
        name="chevron-right"
        size={20}
        color={theme.textSecondary}
        style={styles.chevron}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    marginBottom: Spacing.xs,
  },
  typeRow: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    fontWeight: "600",
  },
  description: {
    marginBottom: Spacing.xs,
  },
  wageRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.xs,
  },
  wage: {
    fontWeight: "700",
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
});

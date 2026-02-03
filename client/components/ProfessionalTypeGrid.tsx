import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { ProfessionalType } from "@/types";
import { useTranslation } from "react-i18next";

interface ProfessionalTypeGridProps {
  onSelectType: (type: ProfessionalType) => void;
}

const PROFESSIONAL_TYPES: {
  type: ProfessionalType;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { type: "Doctor", icon: "activity" },
  { type: "Translator", icon: "globe" },
  { type: "Plumber", icon: "tool" },
  { type: "TourGuide", icon: "map-pin" },
  { type: "Driver", icon: "truck" },
  { type: "Delivery", icon: "package" },
  { type: "Shop", icon: "shopping-bag" },
  { type: "Other", icon: "more-horizontal" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const screenWidth = Dimensions.get("window").width;
const GRID_PADDING = Spacing.lg * 2;
const GRID_GAP = Spacing.md;
const COLUMNS = 4;
const ITEM_SIZE =
  (screenWidth - GRID_PADDING - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

function TypeButton({
  type,
  icon,
  onPress,
  index,
}: {
  type: ProfessionalType;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  index: number;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.typeButton,
          {
            backgroundColor: theme.cardBackground,
            width: ITEM_SIZE,
          },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "15" },
          ]}
        >
          <Feather name={icon} size={24} color={theme.primary} />
        </View>
        <ThemedText
          type="small"
          style={styles.typeLabel}
          numberOfLines={1}
        >
          {t(`professionalTypes.${type}`)}
        </ThemedText>
      </AnimatedPressable>
    </Animated.View>
  );
}

export function ProfessionalTypeGrid({
  onSelectType,
}: ProfessionalTypeGridProps) {
  return (
    <View style={styles.grid}>
      {PROFESSIONAL_TYPES.map((item, index) => (
        <TypeButton
          key={item.type}
          type={item.type}
          icon={item.icon}
          onPress={() => onSelectType(item.type)}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  typeButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    textAlign: "center",
    fontWeight: "500",
  },
});

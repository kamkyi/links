import React, { useState, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { SearchBar } from "@/components/SearchBar";
import { ProfessionalTypeGrid } from "@/components/ProfessionalTypeGrid";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import type { ProfessionalType } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigation.navigate("Results", { searchQuery: searchQuery.trim() });
    }
  }, [searchQuery, navigation]);

  const handleSelectType = useCallback(
    (type: ProfessionalType) => {
      navigation.navigate("Results", { type });
    },
    [navigation],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="h2" style={styles.title}>
        {t("home.title")}
      </ThemedText>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={handleSearch}
        placeholder={t("home.searchPlaceholder")}
      />

      <View style={styles.section}>
        <ThemedText
          type="small"
          style={[styles.sectionTitle, { color: theme.textSecondary }]}
        >
          {t("home.categories")}
        </ThemedText>
        <ProfessionalTypeGrid onSelectType={handleSelectType} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginTop: Spacing["2xl"],
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
    fontWeight: "600",
  },
});

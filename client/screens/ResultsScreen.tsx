import React, { useState, useEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { ProfessionalCard } from "@/components/ProfessionalCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { StorageService } from "@/services/storage";
import type { Profile, ProfessionalType } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type ResultsRouteProp = RouteProp<RootStackParamList, "Results">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultsRouteProp>();

  const { type, searchQuery } = route.params || {};

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const allProfiles = await StorageService.getAllProfiles();
      setProfiles(allProfiles.filter((p) => p.isPublished));
    } catch (error) {
      console.error("Failed to load profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    let result = profiles;

    if (type) {
      result = result.filter((p) => p.professionalType === type);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.displayName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.otherTypeLabel && p.otherTypeLabel.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [profiles, type, searchQuery]);

  const handlePressProfile = (profile: Profile) => {
    navigation.navigate("ProfessionalDetail", { uid: profile.uid });
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <ProfessionalCard profile={item} onPress={() => handlePressProfile(item)} />
  );

  const renderEmpty = () => (
    <EmptyState
      image={require("../../assets/images/empty-results.png")}
      title={t("results.noResults")}
      description={t("results.noResultsDescription")}
    />
  );

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

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: tabBarHeight + Spacing.xl,
          flexGrow: filteredProfiles.length === 0 ? 1 : undefined,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={filteredProfiles}
      keyExtractor={(item) => item.uid}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

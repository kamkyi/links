import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import ResultsScreen from "@/screens/ResultsScreen";
import ProfessionalDetailScreen from "@/screens/ProfessionalDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import type { ProfessionalType } from "@/types";

export type RootStackParamList = {
  Main: undefined;
  Results: {
    type?: ProfessionalType;
    searchQuery?: string;
  };
  ProfessionalDetail: {
    uid: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={({ route }) => ({
          headerTitle: route.params?.type
            ? t(`professionalTypes.${route.params.type}`)
            : t("results.searchResults"),
        })}
      />
      <Stack.Screen
        name="ProfessionalDetail"
        component={ProfessionalDetailScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

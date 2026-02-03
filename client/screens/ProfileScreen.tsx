import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CURRENCIES } from "@/utils/currency";
import type { Profile, ProfessionalType, WageType } from "@/types";

const PROFESSIONAL_TYPES: ProfessionalType[] = [
  "Doctor",
  "Translator",
  "Plumber",
  "TourGuide",
  "Driver",
  "Delivery",
  "Shop",
  "Other",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "th", name: "Thai" },
  { code: "my", name: "Burmese" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, profile, isAuthenticated, signIn, updateProfile } = useAuth();

  const [formData, setFormData] = useState<Partial<Profile>>({
    professionalType: "Doctor",
    otherTypeLabel: "",
    phoneNumber: "",
    address: "",
    description: "",
    wageType: "hourly",
    wageAmount: 0,
    currency: "THB",
    images: [],
    languages: ["en"],
    isPublished: false,
    displayName: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName,
      }));
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const newProfile: Profile = {
        uid: user.uid,
        professionalType: formData.professionalType as ProfessionalType,
        otherTypeLabel: formData.otherTypeLabel || "",
        phoneNumber: formData.phoneNumber || "",
        address: formData.address || "",
        description: formData.description || "",
        wageType: formData.wageType as WageType,
        wageAmount: formData.wageAmount || 0,
        currency: formData.currency || "THB",
        images: formData.images || [],
        languages: formData.languages || ["en"],
        isPublished: formData.isPublished || false,
        displayName: formData.displayName || user.displayName,
      };
      await updateProfile(newProfile);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Failed to save profile:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), result.assets[0].uri],
      }));
    }
  };

  const toggleLanguage = (code: string) => {
    setFormData((prev) => {
      const current = prev.languages || [];
      if (current.includes(code)) {
        return { ...prev, languages: current.filter((l) => l !== code) };
      }
      return { ...prev, languages: [...current, code] };
    });
  };

  if (!isAuthenticated) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundRoot,
            paddingTop: headerHeight + Spacing.xl,
          },
        ]}
      >
        <EmptyState
          image={require("../../assets/images/locked-contact.png")}
          title={t("profile.noProfile")}
          description={t("profile.noProfileDescription")}
          actionLabel={t("authGate.button")}
          onAction={signIn}
        />
      </View>
    );
  }

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
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.displayName")}
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={formData.displayName}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, displayName: text }))
            }
            placeholder={t("profile.displayName")}
            placeholderTextColor={theme.placeholder}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(50).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.professionalType")}
          </ThemedText>
          <View
            style={[
              styles.pickerContainer,
              { backgroundColor: theme.inputBackground, borderColor: theme.border },
            ]}
          >
            <Picker
              selectedValue={formData.professionalType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, professionalType: value }))
              }
              style={{ color: theme.text }}
            >
              {PROFESSIONAL_TYPES.map((type) => (
                <Picker.Item
                  key={type}
                  label={t(`professionalTypes.${type}`)}
                  value={type}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Animated.View>

      {formData.professionalType === "Other" ? (
        <Animated.View entering={FadeInUp.delay(75).springify()}>
          <View style={styles.formGroup}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              {t("profile.otherTypeLabel")}
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.otherTypeLabel}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, otherTypeLabel: text }))
              }
              placeholder={t("profile.otherTypeLabel")}
              placeholderTextColor={theme.placeholder}
            />
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(100).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.phoneNumber")}
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, phoneNumber: text }))
            }
            placeholder="+66 812 345 678"
            placeholderTextColor={theme.placeholder}
            keyboardType="phone-pad"
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(150).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.address")}
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={formData.address}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, address: text }))
            }
            placeholder={t("profile.address")}
            placeholderTextColor={theme.placeholder}
            multiline
            numberOfLines={2}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.description")}
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
                minHeight: 100,
              },
            ]}
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            placeholder={t("profile.description")}
            placeholderTextColor={theme.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(250).springify()}>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              {t("profile.wageType")}
            </ThemedText>
            <View style={styles.wageTypeRow}>
              <Pressable
                onPress={() =>
                  setFormData((prev) => ({ ...prev, wageType: "hourly" }))
                }
                style={[
                  styles.wageTypeButton,
                  {
                    backgroundColor:
                      formData.wageType === "hourly"
                        ? theme.primary
                        : theme.backgroundSecondary,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color:
                      formData.wageType === "hourly" ? "#FFFFFF" : theme.text,
                    fontWeight: "600",
                  }}
                >
                  {t("profile.hourly")}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() =>
                  setFormData((prev) => ({ ...prev, wageType: "daily" }))
                }
                style={[
                  styles.wageTypeButton,
                  {
                    backgroundColor:
                      formData.wageType === "daily"
                        ? theme.primary
                        : theme.backgroundSecondary,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color:
                      formData.wageType === "daily" ? "#FFFFFF" : theme.text,
                    fontWeight: "600",
                  }}
                >
                  {t("profile.daily")}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).springify()}>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              {t("profile.wageAmount")}
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={formData.wageAmount?.toString() || "0"}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  wageAmount: parseInt(text) || 0,
                }))
              }
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
              {t("profile.currency")}
            </ThemedText>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
              ]}
            >
              <Picker
                selectedValue={formData.currency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, currency: value }))
                }
                style={{ color: theme.text }}
              >
                {CURRENCIES.map((curr) => (
                  <Picker.Item
                    key={curr.code}
                    label={`${curr.code} (${curr.symbol})`}
                    value={curr.code}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(350).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.languages")}
          </ThemedText>
          <View style={styles.languageRow}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => toggleLanguage(lang.code)}
                style={[
                  styles.languageChip,
                  {
                    backgroundColor: formData.languages?.includes(lang.code)
                      ? theme.primary
                      : theme.backgroundSecondary,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: formData.languages?.includes(lang.code)
                      ? "#FFFFFF"
                      : theme.text,
                    fontWeight: "500",
                  }}
                >
                  {lang.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <View style={styles.formGroup}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            {t("profile.images")}
          </ThemedText>
          <View style={styles.imagesRow}>
            {formData.images?.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <Pressable
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images?.filter((_, i) => i !== index),
                    }))
                  }
                  style={[
                    styles.removeImageButton,
                    { backgroundColor: theme.error },
                  ]}
                >
                  <Feather name="x" size={12} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={handlePickImage}
              style={[
                styles.addImageButton,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
              ]}
            >
              <Feather name="plus" size={24} color={theme.primary} />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(450).springify()}>
        <View
          style={[
            styles.publishRow,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <View style={styles.publishContent}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {t("profile.publish")}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Make your profile visible to customers
            </ThemedText>
          </View>
          <Switch
            value={formData.isPublished}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, isPublished: value }))
            }
            trackColor={{ false: theme.border, true: theme.primary + "80" }}
            thumbColor={formData.isPublished ? theme.primary : theme.placeholder}
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500).springify()}>
        <Button
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveButton}
        >
          {isSaving ? t("common.loading") : t("profile.save")}
        </Button>
      </Animated.View>
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
  formGroup: {
    marginBottom: Spacing.lg,
  },
  formRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  multilineInput: {
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  wageTypeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  wageTypeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  languageChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  imagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  imageContainer: {
    position: "relative",
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  publishRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  publishContent: {
    flex: 1,
  },
  saveButton: {
    marginBottom: Spacing.xl,
  },
});

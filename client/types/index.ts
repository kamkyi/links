export type ProfessionalType =
  | "Doctor"
  | "Translator"
  | "Plumber"
  | "TourGuide"
  | "Driver"
  | "Delivery"
  | "Shop"
  | "Other";

export type WageType = "hourly" | "daily";

export type UserRole = "customer" | "professional";

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  uid: string;
  professionalType: ProfessionalType;
  otherTypeLabel?: string;
  phoneNumber: string;
  address: string;
  description: string;
  wageType: WageType;
  wageAmount: number;
  currency: string;
  images: string[];
  languages: string[];
  isPublished: boolean;
  displayName: string;
  photoURL?: string;
}

export interface Service {
  id: string;
  uid: string;
  title: string;
  description: string;
  priceAmount: number;
  priceUnit: "hour" | "day" | "job";
  currency: string;
  images: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  uid: string;
  name: string;
  description: string;
  priceAmount: number;
  currency: string;
  stock: number;
  images: string[];
  updatedAt: string;
}

export interface DeliveryLink {
  id: string;
  fromUid: string;
  toUid: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export type SupportedLanguage = "en" | "th" | "my";

export interface AppSettings {
  language: SupportedLanguage;
  displayCurrency: string;
}

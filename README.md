# Link — Service Marketplace (React Native / Expo)

A full React Native Expo app named **Link** (service marketplace with professional profiles and shop management).

---

## 🚀 Tech Stack
- **Frontend:** React Native (Expo) + TypeScript
- **Navigation:** React Navigation
- **UI:** react-native-paper (or NativeWind option)
- **Auth:** Google Sign-In (Expo + Firebase Auth)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage (profile/service/product images)
- **i18n:** i18next + react-i18next
- **Currency:** store money in a base currency, format with `Intl.NumberFormat`

---

## 📋 Core Concept
Users browse and contact professionals (Doctor, Translator, Plumber, Tour Guide, Driver, Shop, Other). Professionals create profiles and list services. Shop users manage products and link to delivery professionals via "Delivery Link".

---

## 🗂 Data Models (Firestore)
1) `users/{uid}`
- uid, displayName, email, photoURL, role: "customer" | "professional"
- createdAt, updatedAt

2) `profiles/{uid}`
- uid
- professionalType: "Doctor" | "Translator" | "Plumber" | "TourGuide" | "Driver" | "Delivery" | "Shop" | "Other"
- otherTypeLabel (string, only if Other)
- phoneNumber, address, description
- wageType: "hourly" | "daily"
- wageAmount (number)
- currency (string, e.g. "THB", "USD")
- images: array of storage URLs
- languages: array of strings (e.g. ["en", "th", "my"])
- isPublished (boolean)

3) `services/{serviceId}`
- uid (owner)
- title, description
- priceAmount (number), priceUnit ("hour" | "day" | "job")
- currency, images[]
- createdAt

4) `products/{productId}` (Shop only)
- uid (shop owner)
- name, description
- priceAmount, currency
- stock (number)
- images[]
- updatedAt

5) `links/{linkId}`
- fromUid (shop uid)
- toUid (delivery professional uid)
- status: "pending" | "accepted" | "rejected"
- createdAt

---

## 🖥 Screens / Flow
A) **Landing / Home**
- Title: “What you are looking for…”
- Search box (name, professional type, keywords)
- Grid of icon buttons for professional types (Doctor, Translator, Plumber, Tour Guide, Driver, Shop, Other)
- Tap icon -> Results List filtered by type; search -> Results List with query

B) **Results List**
- List of professionals (card): avatar/photo, name, professionalType, short description, wage + currency
- Tap card -> Professional Detail

C) **Professional Detail**
- If not logged in: gate screen asking to log in with Google to view contact details
- If logged in: show phone, address, wage, gallery, services list
- Button: "Contact" (show phone + open dialer)

D) **My Profile** (authenticated)
- New users prompted to create profile
- Form: professionalType (+ "Other" detail), phone, address, wage type + amount, currency, upload images, languages (multi-select), publish toggle

E) **Shop Management** (professionalType = Shop)
- Products tab: create/edit/delete products, manage stock
- Delivery Links tab: browse Delivery professionals, send link request, view pending/accepted links

F) **Settings**
- Language switch (en/th/my) with i18n
- Currency display preference
- Logout

---

## ✅ Functional Requirements
- **Search:** filter by professional type and text (name/description). MVP: "startsWith" + type filter if full-text is complex.
- **Auth:** Google sign-in when viewing contact details or creating/editing profile.
- **Security Rules:** users/profiles and services/products writable only by their owners; public read for published items.

---

## 🛠 Project Setup (Replit / Local)
1. Copy the repo and install:
```bash
npm install
```

2. Start dev server (Expo):
```bash
npm run expo:dev
```

3. Build static web (production-like):
```bash
npm run expo:static:build
```

4. Build server bundle (Node):
```bash
npm run server:build
```

### Environment / Firebase
Add Firebase config to your environment (Expo app config uses `EXPO_PUBLIC_` prefix):
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID

Also add Google Sign-In config in the appropriate platform console and reference the client IDs in your Expo/Firebase setup.

---

## 📁 Project Structure (expected)
```
/src
  /screens
  /components
  /navigation
  /services  (firebase.ts, queries.ts)
  /i18n
  /types
```

---

## 🎯 Deliverables & Notes
- Navigation wired up and screens scaffolded (Landing -> Results -> Detail -> My Profile -> Shop Management -> Settings -> i18n)
- Seed/demo data script or a dev-only "Create sample profile" button recommended for development

---

If you'd like, I can add a top-level `build` script to `package.json` that runs both `server:build` and `expo:static:build`, and then run it to verify. 🔧

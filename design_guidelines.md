# Link - Design Guidelines

## 1. Brand Identity

**Purpose**: Link connects customers with local professionals across multiple service categories, creating a trusted marketplace for everyday needs.

**Aesthetic Direction**: **Accessible & Trustworthy** — Clean, practical interface with friendly warmth. Emphasize clarity and efficiency over decoration. Think practical marketplace (like Grab or similar regional apps), not corporate or playful.

**Memorable Element**: The professional type grid on the home screen uses colorful, distinctive icons that feel like a mobile home screen — instantly recognizable and easy to navigate.

**Differentiation**: Auth-gated contact details create a clear value exchange (sign in to connect), while the icon grid makes browsing professional types feel intuitive and fast.

## 2. Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs when logged in, 2 when logged out)
- **Home** - Browse/search professionals
- **Profile** - My professional profile (only when logged in)
- **Settings** - Language, currency, logout

**Screen List**:
1. **Landing/Home** - Search + professional type grid
2. **Results List** - Filtered professionals
3. **Professional Detail** - Full profile view OR auth gate
4. **My Profile** - Create/edit professional profile
5. **Shop Management** - Products + Delivery Links (Shop type only)
6. **Settings** - Language, currency, logout

## 3. Screen-by-Screen Specifications

### Landing/Home
**Purpose**: Quick discovery of professionals by type or search

**Layout**:
- Header: Transparent, no buttons, title: "What are you looking for…"
- Top inset: headerHeight + Spacing.xl
- Content: Scrollable
  - Search bar (rounded, with search icon)
  - Professional type grid (2 columns on mobile, 3+ on tablet)
    - Each cell: Icon (48x48), label below
    - Icons: Doctor (stethoscope), Translator (language), Plumber (wrench), Tour Guide (map), Driver (car), Shop (storefront), Other (dots)
  - Spacing between search and grid: Spacing.lg
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Search input, icon grid (pressable cards)

### Results List
**Purpose**: Browse filtered professionals

**Layout**:
- Header: Standard with back button, title shows filter (e.g., "Doctors" or "Search results")
- Top inset: Spacing.xl
- Content: FlatList
  - Card per professional:
    - Left: Avatar (60x60, circular)
    - Right: Name (Typography.heading3), type badge, description (2 lines max), wage display
  - Empty state: empty-results.png illustration
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Professional cards, empty state

### Professional Detail (Logged Out)
**Purpose**: Encourage sign-in to view contact details

**Layout**:
- Header: Standard with back button
- Top inset: Spacing.xl
- Content: Centered card
  - Illustration: locked-contact.png
  - Heading: "Sign in to view contact details"
  - Body text: "Connect with professionals by signing in with Google"
  - Primary button: "Continue with Google"
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Auth gate card, illustration

### Professional Detail (Logged In)
**Purpose**: View full professional profile + contact

**Layout**:
- Header: Standard with back button
- Top inset: Spacing.xl
- Content: ScrollView
  - Image gallery (horizontal scroll if multiple)
  - Name (Typography.heading1)
  - Professional type badge
  - Wage display (large, prominent)
  - Contact section: Phone number (pressable to dial), Address
  - Description
  - Languages (chips)
  - Services list (if any)
- Bottom: Floating action button "Contact" (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)
- Bottom inset: tabBarHeight + Spacing.xl + 60 (FAB height)

**Components**: Image gallery, info sections, service cards, floating button

### My Profile
**Purpose**: Create/edit professional profile

**Layout**:
- Header: Standard with title "My Profile", right button: "Save"
- Top inset: Spacing.xl
- Content: ScrollView form
  - Professional type dropdown
  - Conditional "Other" text input
  - Phone, Address inputs
  - Wage type selector (hourly/daily)
  - Wage amount + Currency inputs
  - Image upload area (shows thumbnails)
  - Language multi-select
  - Publish toggle
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Form inputs, dropdowns, image picker, multi-select, toggle

### Shop Management (Shop users only)
**Purpose**: Manage products and delivery partnerships

**Layout**:
- Header: Standard with title "Shop Management"
- Top inset: Spacing.xl
- Content: Tab view (Products | Delivery Links)
  - Products tab: List of products with stock count, add button (FAB)
  - Delivery Links tab: List of connected/pending delivery professionals
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Tabs, product cards, link cards, FAB

### Settings
**Purpose**: App preferences and account management

**Layout**:
- Header: Standard with title "Settings"
- Top inset: Spacing.xl
- Content: Grouped list
  - Language selector
  - Currency display preference
  - Logout button (destructive style)
- Bottom inset: tabBarHeight + Spacing.xl

**Components**: Setting rows, pickers

## 4. Color Palette

**Primary**: #00A896 (Teal) - Trust, professionalism, friendly
**Primary Dark**: #008577
**Accent**: #FF6B35 (Warm orange) - Call-to-action, Contact buttons
**Background**: #F8F9FA (Light warm gray)
**Surface**: #FFFFFF
**Text Primary**: #1A1A1A
**Text Secondary**: #6B7280
**Border**: #E5E7EB
**Success**: #10B981
**Error**: #EF4444
**Warning**: #F59E0B

## 5. Typography

**Font**: System default (SF Pro on iOS, Roboto on Android) for maximum legibility

**Type Scale**:
- heading1: 28px, Bold
- heading2: 22px, Semibold
- heading3: 18px, Semibold
- body: 16px, Regular
- bodySmall: 14px, Regular
- caption: 12px, Regular
- button: 16px, Semibold

## 6. Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

## 7. Assets to Generate

1. **icon.png** - App icon featuring stylized link/connection symbol in teal
   - WHERE USED: Device home screen

2. **splash-icon.png** - Same as icon.png
   - WHERE USED: App launch screen

3. **empty-results.png** - Simple illustration of empty search/binoculars
   - WHERE USED: Results List when no professionals found

4. **locked-contact.png** - Illustration of lock/shield with professional silhouette
   - WHERE USED: Professional Detail auth gate screen

5. **Professional Type Icons** (48x48 each, simple line style in Primary color):
   - doctor-icon.png (stethoscope)
   - translator-icon.png (speech bubbles with "A 文")
   - plumber-icon.png (wrench)
   - tourguide-icon.png (map marker)
   - driver-icon.png (car)
   - shop-icon.png (storefront)
   - other-icon.png (three dots)
   - delivery-icon.png (package/box)
   - WHERE USED: Landing/Home professional type grid

6. **avatar-placeholder.png** - Generic circular avatar (gray silhouette)
   - WHERE USED: User profiles without uploaded photo
# 🎨 App Assets Guide
**DESIGNSNACK Laws & Patterns - Complete Asset Requirements**

---

## 📁 Folder Structure

```
assets/
├── app-icons/
│   ├── ios/                    # iOS app icons
│   ├── android/                # Android app icons
│   └── app-store/             # App Store & Play Store icons
├── splash-screens/            # Splash screen images
└── screenshots/               # App Store screenshots
    ├── ios/                   # iPhone & iPad screenshots
    └── android/               # Android phone & tablet screenshots
```

---

## 📱 iOS App Icons Requirements

### **Required Sizes**

| Size | Usage | Filename | Notes |
|------|-------|----------|-------|
| **1024×1024** | App Store | `icon-1024.png` | Required, no transparency, no alpha |
| **180×180** | iPhone @3x | `icon-180.png` | iPhone 14 Pro, 13 Pro, 12 Pro |
| **167×167** | iPad Pro @2x | `icon-167.png` | 12.9" iPad Pro |
| **152×152** | iPad @2x | `icon-152.png` | iPad Air, iPad mini |
| **120×120** | iPhone @2x | `icon-120.png` | iPhone SE, older models |
| **87×87** | iPhone @3x (Settings) | `icon-87.png` | Settings icon |
| **80×80** | iPad @2x (Spotlight) | `icon-80.png` | iPad Spotlight |
| **76×76** | iPad @1x | `icon-76.png` | Non-Retina iPad |
| **60×60** | iPhone @2x | `icon-60.png` | Older iPhone models |
| **58×58** | iPhone @2x (Settings) | `icon-58.png` | Settings icon |
| **40×40** | iPad @1x (Spotlight) | `icon-40.png` | iPad Spotlight |
| **29×29** | iPhone/iPad @1x | `icon-29.png` | Settings icon |
| **20×20** | iPhone/iPad @1x | `icon-20.png` | Notification icon |

### **Design Guidelines**
- ✅ **Format:** PNG (no transparency)
- ✅ **Color space:** sRGB
- ✅ **No rounded corners** (iOS adds them automatically)
- ✅ **Safe area:** Keep important elements away from edges
- ✅ **No text** (keep it simple and recognizable)
- ✅ **Consistent design** across all sizes

### **Export Location**
Place all iOS icons in: `assets/app-icons/ios/`

---

## 🤖 Android App Icons Requirements

### **Required Sizes**

| Size | Density | Filename | Usage |
|------|---------|----------|-------|
| **512×512** | N/A | `icon-512.png` | Google Play Store |
| **192×192** | xxxhdpi | `icon-192.png` | High-res devices |
| **144×144** | xxhdpi | `icon-144.png` | Tablet devices |
| **96×96** | xhdpi | `icon-96.png` | Most phones |
| **72×72** | hdpi | `icon-72.png` | Older devices |
| **48×48** | mdpi | `icon-48.png` | Base density |

### **Adaptive Icon (Android 8.0+)**

Android uses **Adaptive Icons** with two layers:

| Layer | Size | Filename | Notes |
|-------|------|----------|-------|
| **Foreground** | 1024×1024 | `adaptive-icon-foreground.png` | Main icon design |
| **Background** | 1024×1024 | `adaptive-icon-background.png` | Solid color or simple pattern |

**Safe Zone:**
- Keep your icon design within the **66% central circle**
- Outside this area may be cropped by different device shapes

### **Design Guidelines**
- ✅ **Format:** PNG with transparency (for adaptive icon)
- ✅ **Rounded corners:** Optional (system applies device-specific shape)
- ✅ **Adaptive design:** Test with circle, squircle, rounded square
- ✅ **Background layer:** Can be solid color matching your brand

### **Export Location**
Place all Android icons in: `assets/app-icons/android/`

---

## 🎯 App Store & Play Store Icons

### **iOS App Store**
- **Size:** 1024×1024 pixels
- **Format:** PNG (no transparency)
- **Filename:** `app-store-icon.png`
- **Location:** `assets/app-icons/app-store/`
- **Notes:** This appears in search results and product page

### **Google Play Store**
- **Size:** 512×512 pixels
- **Format:** PNG (32-bit with alpha channel)
- **Filename:** `play-store-icon.png`
- **Location:** `assets/app-icons/app-store/`
- **Notes:** Displayed on Google Play listing

---

## 🌅 Splash Screen Requirements

### **Expo Splash Screen**

| Platform | Size | Aspect Ratio | Filename |
|----------|------|--------------|----------|
| **Universal** | 1242×2436 | Any | `splash.png` |
| **iOS** | 2048×2732 | Tablet | `splash-ios.png` |
| **Android** | 1242×2436 | Any | `splash-android.png` |

### **Design Guidelines**
- ✅ **Keep centered:** Use safe area for important content
- ✅ **Simple design:** Logo + background color works best
- ✅ **Fast loading:** Will display during app initialization
- ✅ **Match branding:** Use your app colors

### **Recommended Design**
```
- Background: White or #768B9B
- Center: App logo/icon (512×512)
- Bottom: "DESIGNSNACK Laws & Patterns" text
```

### **Export Location**
Place splash screens in: `assets/splash-screens/`

---

## 📸 Screenshot Requirements

### **iOS Screenshots (Required)**

#### **iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)**
- **Size:** 1290×2796 pixels (portrait)
- **Quantity:** Minimum 3, maximum 10
- **Filename:** `iphone-6.7-[1-10].png`
- **Location:** `assets/screenshots/ios/`

#### **iPhone 6.5" (iPhone 11 Pro Max, XS Max)**
- **Size:** 1242×2688 pixels (portrait)
- **Quantity:** Minimum 3, maximum 10
- **Filename:** `iphone-6.5-[1-10].png`

#### **iPad Pro 12.9" (6th gen)**
- **Size:** 2048×2732 pixels (portrait)
- **Quantity:** Minimum 3, maximum 10
- **Filename:** `ipad-12.9-[1-10].png`

### **Android Screenshots (Required)**

#### **Phone Screenshots**
- **Size:** 1080×1920 pixels minimum (9:16 aspect ratio)
- **Quantity:** Minimum 2, maximum 8
- **Filename:** `android-phone-[1-8].png`
- **Location:** `assets/screenshots/android/`

#### **Tablet Screenshots (Optional)**
- **Size:** 1920×1200 pixels minimum
- **Quantity:** Minimum 2, maximum 8
- **Filename:** `android-tablet-[1-8].png`

### **Screenshot Strategy**

**Recommended 5 Screenshots:**

1. **Library Screen** (`screenshot-1-library.png`)
   - Show the full principle library
   - Display category filters
   - Highlight search functionality

2. **Principle Detail** (`screenshot-2-detail.png`)
   - Show a complete principle page
   - Display rich content (definition, do's, don'ts)
   - Show example if available

3. **Quiz Interface** (`screenshot-3-quiz.png`)
   - Display quiz question
   - Show multiple choice options
   - Interactive learning feature

4. **Flashcards** (`screenshot-4-flashcards.png`)
   - Show flashcard front/back
   - Display progress indicator
   - Study mode feature

5. **Categories Overview** (`screenshot-5-categories.png`)
   - Show all 6 categories
   - Display category icons/colors
   - Organized learning paths

### **Design Tips for Screenshots**
- ✅ **Add text overlays** explaining features (optional)
- ✅ **Use real content** not placeholder text
- ✅ **Show key interactions** (taps, swipes, etc.)
- ✅ **Keep UI clean** remove any debug info
- ✅ **Consistent branding** match your app design

---

## 🎨 Design Specifications

### **Brand Colors**
```css
Primary Blue-Gray: #768B9B
Black: #000000
White: #FFFFFF
Gray: #6B7280

Category Colors:
- UX Laws: #3B82F6 (blue)
- Cognitive Biases: #8B5CF6 (purple)
- Heuristics: #10B981 (green)
- Design Principles: #F59E0B (orange)
- Psychology: #EF4444 (red)
- Gestalt: #06B6D4 (cyan)
```

### **Typography**
```
App Font: System Default (SF Pro for iOS, Roboto for Android)
Headings: 600 weight (semibold)
Body: 400 weight (regular)
```

---

## 🛠️ Tools & Resources

### **Icon Design Tools**
- **Figma** - [figma.com](https://figma.com) (Recommended)
- **Sketch** - [sketch.com](https://sketch.com)
- **Adobe Illustrator** - Professional vector editing
- **Canva** - [canva.com](https://canva.com) (Quick mockups)

### **Icon Generators**
- **App Icon Generator** - [appicon.co](https://appicon.co)
- **Adaptive Icon** - [adapticon.tooo.io](https://adapticon.tooo.io)
- **Make App Icon** - [makeappicon.com](https://makeappicon.com)

### **Screenshot Tools**
- **Expo Simulator** - Built-in screenshot capture
- **Screenshots.pro** - [screenshots.pro](https://screenshots.pro)
- **Shotbot** - [shotbot.io](https://shotbot.io)
- **Device Frames** - [deviceframes.com](https://deviceframes.com)

### **Testing Tools**
- **iOS Preview** - Test icon in App Store Connect
- **Android Testing** - Test adaptive icon shapes in Play Console
- **BrowserStack** - Test on real devices

---

## ✅ Pre-Export Checklist

### **Before Exporting Icons:**
- [ ] Design works at smallest size (20×20)
- [ ] No transparency in iOS icons (except adaptive Android)
- [ ] Safe area considered for adaptive icon
- [ ] Tested on both light and dark backgrounds
- [ ] Consistent visual style across all sizes

### **Before Taking Screenshots:**
- [ ] Remove debug information
- [ ] Use real content (103 principles loaded)
- [ ] Test on actual device sizes
- [ ] Consistent UI state across screenshots
- [ ] No personal data visible

### **Before Submission:**
- [ ] All required icon sizes exported
- [ ] Screenshots capture key features
- [ ] File formats correct (PNG for all)
- [ ] File sizes optimized (< 5MB per file)
- [ ] Filenames follow convention

---

## 📋 Export Commands (if using Figma)

### **Batch Export iOS Icons**
1. Select all iOS icon frames
2. Export Settings → PNG → 1x
3. Export to: `assets/app-icons/ios/`

### **Batch Export Android Icons**
1. Select all Android icon frames
2. Export Settings → PNG → 1x
3. Export to: `assets/app-icons/android/`

### **Export with Transparent Background**
- Android adaptive icons: Keep transparency ✅
- iOS icons: Remove transparency ❌

---

## 🚀 Next Steps

1. **Design Phase**
   - Create your icon design in 1024×1024 size
   - Test at small sizes (20×20) to ensure clarity
   - Get feedback from team/users

2. **Export Phase**
   - Use an icon generator tool (saves time)
   - Manually export if you need custom adjustments
   - Organize files in correct folders

3. **Testing Phase**
   - Preview on actual devices
   - Test different backgrounds
   - Check adaptive icon shapes (Android)

4. **Implementation Phase**
   - Update `app.json` with icon paths
   - Configure splash screen in Expo
   - Test on simulator/emulator

5. **Screenshots Phase**
   - Capture on required device sizes
   - Add text overlays if needed
   - Optimize file sizes

---

## 💡 Pro Tips

- **Use vector graphics** (SVG) for original design - easier to scale
- **Export 2x size first** then downscale for better quality
- **Keep source files** organized (Figma, Sketch, etc.)
- **Version control** your assets (git or cloud storage)
- **Test on devices** not just simulators
- **Get early feedback** before finalizing design

---

**Need Help?**
- 📧 Reference: `APP_STORE_GUIDE.md` for submission requirements
- 🎨 Brand colors: Check main website at designsnack.ch
- 🔧 Expo docs: [docs.expo.dev](https://docs.expo.dev)

---

*Last Updated: October 2025*
*Ready for icon design and screenshot creation!*

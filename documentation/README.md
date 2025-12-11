# Togather Documentation

This folder contains project documentation, screenshots, and visual evolution tracking.

## 📸 Screenshot Guide

### How to Capture Screenshots

1. **Device Frame:** Use Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. **Resolution:** Set to iPhone 14 Pro (393 x 852) or custom 480 x 844
3. **Capture:** Right-click → "Capture screenshot" or use screenshot extension

### Recommended Tools
- [Responsively App](https://responsively.app/) - View multiple screen sizes
- [Full Page Screen Capture](https://chrome.google.com/webstore/detail/full-page-screen-capture/) - Chrome extension
- [CleanShot X](https://cleanshot.com/) - macOS screenshot tool

### Key Screens to Capture
1. **Login Page** - `/login`
2. **Dashboard** - `/dashboard` (with events)
3. **Event Detail** - `/events/[id]` (with roles filled)
4. **New Event Form** - `/events/new`
5. **Members List** - `/members`
6. **Profile Page** - `/profile`
7. **Live Tools** - `/tools` (Roda Undian & Kartu Sharing)

## 📁 Folder Structure

```
documentation/
├── README.md                 # This file
├── screenshots/
│   ├── v1-before-revamp/    # Initial MVP designs
│   │   ├── dashboard.png
│   │   ├── event-detail.png
│   │   └── ...
│   └── v2-after-revamp/     # Polished UI
│       ├── dashboard.png
│       ├── event-detail.png
│       └── ...
└── assets/
    └── logo.png             # Branding assets
```

## 🎨 Design Decisions

### Color Palette
- **Primary:** Indigo-600 (`#4F46E5`)
- **Success:** Emerald-500 (`#10B981`)
- **Warning:** Amber-500 (`#F59E0B`)
- **Danger:** Red-600 (`#DC2626`)

### Typography
- **Headings:** font-heading (system font stack)
- **Body:** Default Tailwind sans-serif

### Spacing
- **Card padding:** `p-3` (compact)
- **Card gap:** `gap-4` (16px)
- **Border radius:** `rounded-lg` (8px)

## 📋 Version History

See [CHANGELOG.md](../CHANGELOG.md) for detailed version history.

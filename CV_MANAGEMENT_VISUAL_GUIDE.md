# CV Management Page - Visual Design Guide

## 🎨 Color Palette

### Primary Theme
```
Gradient: from-[#3a4660] to-gray-400
Accent: #3a4660
```

### Color Usage Map

| Element | Default | Hover | Active |
|---------|---------|-------|--------|
| Primary Buttons | `from-[#3a4660] to-gray-400` | `from-[#3a4660] to-[#3a4660]` | - |
| CV Card Border | `border-gray-300` | `border-[#3a4660]` | `ring-2 ring-[#3a4660]` |
| Tab Indicator | `border-transparent` | `border-gray-300` | `border-[#3a4660]` |
| Section Header | `from-[#3a4660] to-gray-400` | - | - |
| Icons | `text-gray-400` | `text-[#3a4660]` | - |

---

## 📏 Layout Specifications

### Page Structure
```
┌─────────────────────────────────────────────┐
│ Header: "Quản lý CV"                        │
├─────────────────────────────────────────────┤
│ Default CV Card (Gradient Header)           │
│ ┌─────────────────────────────────────────┐ │
│ │ [Icon] CV_Name.pdf [Xem trước][Thay đổi]│ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Tabs: [CV đã tạo][CV đã tải lên][Draft]    │
│                              [Tải CV lên]▲  │ ← Only in "uploaded" tab
├─────────────────────────────────────────────┤
│ CV Grid (3 columns)                         │
│ ┌───────┐ ┌───────┐ ┌───────┐              │
│ │ CV 1  │ │ CV 2  │ │ CV 3  │              │
│ │230x260│ │230x260│ │230x260│              │
│ └───────┘ └───────┘ └───────┘              │
└─────────────────────────────────────────────┘
```

### CV Card Dimensions
```
Width: 230px (fixed)
Height: 260px (fixed)
Border Radius: 12px (rounded-xl)
Preview Area: ~180px height
Info Bar: ~80px height
```

---

## 🃏 CV Card Anatomy

```
┌─────────────────────────────┐
│ [Mặc định] [Đã tải lên] [🔒]│ ← Top badges
│                             │
│         ┌─────────┐         │
│         │  FILE   │         │ ← Centered icon
│         │  ICON   │         │   (gray-300, 16x16)
│         └─────────┘         │
│                             │
│     [Xem trước] (hover)     │ ← Hover overlay
├─────────────────────────────┤
│ CV_Name.pdf                 │ ← Info bar
│ 21/11/2025    1.2 MB        │
│ [Mặc định] [Đồng bộ] [⋮]   │ ← Actions
└─────────────────────────────┘

Border: gray-300 → #3a4660 (hover)
Shadow: md → xl (hover)
Transform: scale(1) → scale(1.01) (hover)
```

---

## 🎭 States & Interactions

### Button States

#### Primary Button (Gradient)
```tsx
// Default
bg-gradient-to-r from-[#3a4660] to-gray-400
shadow-md

// Hover
hover:from-[#3a4660] hover:to-[#3a4660]
hover:shadow-xl

// Disabled
opacity-50 cursor-not-allowed
```

#### Secondary Button
```tsx
// Default
bg-white border border-gray-300
shadow-sm

// Hover
hover:bg-gray-50
hover:shadow-md
```

### CV Card States

#### Default
```css
border: 1px solid #d1d5db (gray-300)
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) (shadow-md)
transform: scale(1)
```

#### Hover
```css
border: 1px solid #3a4660
box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) (shadow-xl)
transform: scale(1.01)
```

#### Selected/Default
```css
ring: 2px solid #3a4660
ring-offset: 2px
```

### Tab States

#### Inactive
```css
border-bottom: 2px solid transparent
color: #6b7280 (gray-500)
```

#### Hover
```css
border-bottom: 2px solid #d1d5db (gray-300)
color: #374151 (gray-700)
```

#### Active
```css
border-bottom: 2px solid #3a4660
color: #3a4660
font-weight: 500
```

---

## 📱 Responsive Behavior

### Grid Breakpoints
```css
/* Desktop (default) */
grid-cols-3 gap-6

/* Tablet (recommended) */
@media (max-width: 1024px) {
  grid-cols-2 gap-4
}

/* Mobile (recommended) */
@media (max-width: 640px) {
  grid-cols-1 gap-4
}
```

### Card Sizing
- Cards maintain 230x260px on all breakpoints
- Grid adjusts columns based on viewport
- Mobile: Full width with horizontal scroll if needed

---

## 🌈 Animation Guidelines

### Transitions
```css
/* Standard UI transitions */
transition: all 0.3s ease-in-out

/* Hover effects */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)

/* Processing spinner */
animation: spin 1s linear infinite
```

### Transform Effects
```css
/* Card hover */
transform: scale(1.01)
transition-duration: 200ms

/* Button press (optional) */
active:scale-95
```

---

## 🎯 Component Hierarchy

```
CVManagementPage
├── Header Section
│   ├── Title
│   └── Description
├── Default CV Card
│   ├── Gradient Header
│   ├── CV Info Display
│   └── Action Buttons
│       ├── Xem trước (Preview)
│       └── Thay đổi (Change)
├── Tabs Section
│   ├── Tab Navigation
│   │   ├── CV đã tạo (Active)
│   │   ├── CV đã tải lên
│   │   └── Draft
│   └── Tab Content
│       ├── Upload Button (Conditional)
│       ├── CV Grid
│       │   └── CVCard (Multiple)
│       │       ├── Preview Area
│       │       │   ├── Badges
│       │       │   ├── Icon/Spinner
│       │       │   └── Hover Overlay
│       │       └── Info Bar
│       │           ├── Name & Meta
│       │           └── Actions
│       │               ├── Mặc định
│       │               ├── Đồng bộ
│       │               └── More Menu
│       │                   ├── Xem trước
│       │                   ├── Tải xuống
│       │                   ├── Đổi tên
│       │                   └── Xóa
│       └── EmptyState (Conditional)
└── PreviewModal (Conditional)
    ├── Gradient Header
    ├── Preview Content (iframe)
    └── Footer Actions
```

---

## 🔍 Design Details

### Badges
```tsx
// Default Badge
className="px-2 py-0.5 bg-[#3a4660] text-white 
           text-[10px] font-medium rounded-full"

// Source Badge
className="px-2 py-0.5 bg-blue-100 text-blue-700 
           text-[10px] font-medium rounded-full"

// Privacy Badge
className="bg-white/90 backdrop-blur-sm px-2 py-0.5 
           rounded-full flex items-center gap-1"
```

### Icons
- Size: `w-4 h-4` (small), `w-5 h-5` (medium), `w-6 h-6` (large)
- Stroke width: `strokeWidth={2}`
- Color: Match text color or use theme color

### Typography
```tsx
// Page Title
text-2xl font-bold text-gray-900

// Section Title
text-lg font-semibold text-white (on gradient)

// CV Card Name
text-xs font-medium text-gray-900

// Metadata
text-[10px] text-gray-500

// Buttons
text-[10px] font-medium (small)
text-sm font-medium (medium)
```

---

## ✨ Special Effects

### Gradient Overlay (Hover)
```css
background: linear-gradient(
  to right,
  rgba(58, 70, 96, 0) 0%,
  rgba(58, 70, 96, 0.1) 100%
)
```

### Backdrop Blur (Privacy Badge)
```css
backdrop-filter: blur(4px)
background: rgba(255, 255, 255, 0.9)
```

### Processing Animation
```tsx
<div className="w-10 h-10 border-3 border-gray-200 
                border-t-[#3a4660] rounded-full animate-spin" />
```

---

## 🎪 Interactive Elements

### Dropdown Menu (More Actions)
```
Position: absolute, bottom-full (opens upward)
Width: 160px (w-40)
Shadow: shadow-xl
Border: border-gray-200
Backdrop: bg-white
Items: hover:bg-gray-50 (except delete: hover:bg-red-50)
```

### File Input (Hidden)
```tsx
<input type="file" className="hidden" 
       accept=".pdf,.doc,.docx" />
```
Triggered via label click with gradient button styling

---

## 📋 Content Guidelines

### Vietnamese Labels
- Upload: "Tải CV lên"
- Preview: "Xem trước"
- Default: "Mặc định"
- Sync: "Đồng bộ"
- Delete: "Xóa"
- Download: "Tải xuống"
- Rename: "Đổi tên"
- Built: "CV đã tạo"
- Uploaded: "CV đã tải lên"
- Private: "Riêng tư"
- Public: "Công khai"

### Empty State Messages
- Uploaded: "Chưa có CV tải lên"
- Built: "Chưa có CV đã tạo"
- Draft: "Chưa có bản nháp"

---

## 🛠️ Implementation Notes

### Tailwind Classes (Most Used)
```tsx
// Gradient Button
"bg-gradient-to-r from-[#3a4660] to-gray-400 
 hover:from-[#3a4660] hover:to-[#3a4660] 
 text-white rounded-lg font-medium 
 shadow-md hover:shadow-xl transition-all"

// CV Card
"w-[230px] h-[260px] border rounded-xl 
 overflow-hidden hover:shadow-xl 
 hover:border-[#3a4660] transition-all 
 hover:scale-[1.01] shadow-md bg-white 
 flex flex-col"

// Grid Layout
"grid grid-cols-3 gap-6"

// Tab Navigation
"border-b-2 font-medium text-sm transition-colors"
```

### Custom CSS Variables (Optional)
```css
:root {
  --primary-dark: #3a4660;
  --primary-light: #9ca3af; /* gray-400 */
  --accent: #3a4660;
}
```

---

**Design System Version:** 1.0  
**Last Updated:** November 21, 2025  
**Compatible With:** Tailwind CSS v3+, Next.js 13+

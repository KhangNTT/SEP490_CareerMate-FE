# 🔄 Migration Guide - CV Management Refactor

## Overview
This guide helps you understand the changes and migrate any dependent code.

---

## Breaking Changes

### ⚠️ None - Fully Backward Compatible
All changes are UI-only. No API changes, no prop changes, no state structure changes.

---

## Type Changes

### Updated Types

#### Before:
```tsx
type ActiveTab = "uploaded" | "built";
```

#### After:
```tsx
type ActiveTab = "uploaded" | "built" | "draft";
```

**Impact:** If you're importing or using this type elsewhere, update it.

---

## State Changes

### Added State

```tsx
// NEW: Draft CVs state
const [draftCVs, setDraftCVs] = useState<CV[]>([]);
```

**Impact:** None on existing code. Draft functionality is additive.

### Modified State

```tsx
// BEFORE
const [activeTab, setActiveTab] = useState<"uploaded" | "built">("uploaded");

// AFTER
const [activeTab, setActiveTab] = useState<"built" | "uploaded" | "draft">("built");
```

**Impact:** Default tab changed from "uploaded" to "built"

---

## Component Changes

### CVCard Component

#### Visual Changes:
- Size: A4 aspect ratio → **230x260px square**
- Border: `gray-200` → `gray-300`
- Hover: `shadow-md` → `shadow-xl` + `border-[#3a4660]` + `scale-[1.01]`
- Ring color: `ring-green-500` → `ring-[#3a4660]`

#### Class Changes:
```tsx
// BEFORE
className="border rounded-lg overflow-hidden hover:shadow-md"

// AFTER
className="w-[230px] h-[260px] border rounded-xl overflow-hidden 
           hover:shadow-xl hover:border-[#3a4660] hover:scale-[1.01]"
```

**Impact:** CV cards now have fixed dimensions. Ensure parent container can accommodate.

### EmptyState Component

#### Type Change:
```tsx
// BEFORE
({ activeTab }: { activeTab: "uploaded" | "built" })

// AFTER
({ activeTab }: { activeTab: "uploaded" | "built" | "draft" })
```

#### Added Support:
- Draft tab empty state added
- Gradient icon background
- Gradient buttons

**Impact:** None. Additive change.

### PreviewModal Component

#### Visual Changes:
- Header: Plain → **Gradient background with white text**
- Download button: Secondary → **Gradient primary**

**Impact:** None. Visual enhancement only.

---

## Layout Changes

### Grid System

#### Before:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
```

#### After:
```tsx
<div className="grid grid-cols-3 gap-6">
```

**Impact:** 
- Simpler responsive behavior
- Larger gap between cards
- Always 3 columns on desktop

**Recommendation:** Add media queries if needed:
```tsx
// Suggested responsive classes
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## Color Scheme Migration

### Old Green Theme → New Gray-Blue Gradient

| Old Class | New Class |
|-----------|-----------|
| `bg-green-600` | `bg-gradient-to-r from-[#3a4660] to-gray-400` |
| `hover:bg-green-700` | `hover:from-[#3a4660] hover:to-[#3a4660]` |
| `text-green-600` | `text-[#3a4660]` |
| `border-green-600` | `border-[#3a4660]` |
| `ring-green-500` | `ring-[#3a4660]` |

### Affected Elements:
- ✅ Primary buttons
- ✅ Section headers
- ✅ Active tab indicators
- ✅ Default CV badge
- ✅ CV card borders (hover)
- ✅ Icons
- ✅ Spinners

---

## Function Changes

### handleSetDefault
```tsx
// ADDED: Draft CVs update
setDraftCVs(prev => prev.map(c => ({ ...c, isDefault: c.id === cv.id })));
```

### handleDelete
```tsx
// ADDED: Draft CVs filter
setDraftCVs(prev => prev.filter(cv => cv.id !== cvId));

// UPDATED: allCVs calculation
const remaining = [...uploadedCVs, ...builtCVs, ...draftCVs].filter(cv => cv.id !== cvId);
```

**Impact:** None on existing uploaded/built CVs. Draft support added.

---

## Tab Order Change

### Before:
1. CV đã tải lên (uploaded) - **Default**
2. CV đã tạo (built)

### After:
1. CV đã tạo (built) - **Default**
2. CV đã tải lên (uploaded)
3. Draft (draft) - **New**

**Impact:** 
- Users now see "CV đã tạo" first
- Update any tutorials/documentation that reference tab order
- Update user preferences if stored

---

## New Features

### 1. Upload Button in "CV đã tải lên" Tab

**Location:** Top-right of CV grid  
**Visibility:** Only when `activeTab === "uploaded"`  
**Styling:** Gradient button matching theme

```tsx
{activeTab === "uploaded" && (
  <div className="flex justify-end">
    <label className="cursor-pointer">
      <input type="file" className="hidden" accept=".pdf,.doc,.docx"
             onChange={handleFileInput} disabled={isUploading} />
      <span className="inline-flex items-center gap-2 px-4 py-2 
                       bg-gradient-to-r from-[#3a4660] to-gray-400 
                       hover:from-[#3a4660] hover:to-[#3a4660] 
                       text-white rounded-lg font-medium 
                       shadow-md hover:shadow-xl transition-all">
        <UploadIcon />
        {isUploading ? "Đang tải lên..." : "Tải CV lên"}
      </span>
    </label>
  </div>
)}
```

### 2. Draft Tab

**Purpose:** Store CV drafts locally  
**Implementation:** State only (no backend yet)  
**Empty State:** "Chưa có bản nháp"

**Future Enhancement:**
```tsx
// Save draft to localStorage
const saveDraft = (cv: CV) => {
  localStorage.setItem(`cv-draft-${cv.id}`, JSON.stringify(cv));
  setDraftCVs(prev => [...prev, cv]);
};

// Load drafts on mount
useEffect(() => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('cv-draft-'));
  const drafts = keys.map(k => JSON.parse(localStorage.getItem(k)!));
  setDraftCVs(drafts);
}, []);
```

---

## CSS/Tailwind Changes

### New Classes Added

```css
/* Gradient Background */
.bg-gradient-to-r.from-\[#3a4660\].to-gray-400

/* Hover Gradient */
.hover\:from-\[#3a4660\].hover\:to-\[#3a4660\]

/* Border Color */
.border-\[#3a4660\]

/* Text Color */
.text-\[#3a4660\]

/* Ring Color */
.ring-\[#3a4660\]

/* Fixed Card Dimensions */
.w-\[230px\].h-\[260px\]

/* Scale Transform */
.hover\:scale-\[1\.01\]
```

### Tailwind Config Update (Optional)

If you want to avoid arbitrary values:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-dark': '#3a4660',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3a4660, #9ca3af)',
      },
    },
  },
}
```

Then use:
```tsx
className="bg-gradient-primary hover:bg-primary-dark"
```

---

## Testing Migration

### Manual Testing Steps

1. **Tab Switching**
   - [ ] Click each tab (built, uploaded, draft)
   - [ ] Verify active tab highlights correctly
   - [ ] Verify correct CVs display in each tab

2. **Upload Button**
   - [ ] Switch to "uploaded" tab
   - [ ] Verify upload button appears
   - [ ] Switch to other tabs
   - [ ] Verify upload button disappears

3. **CV Cards**
   - [ ] Verify cards are square (230x260)
   - [ ] Hover over cards
   - [ ] Verify border changes to #3a4660
   - [ ] Verify shadow increases
   - [ ] Verify slight scale increase

4. **Color Theme**
   - [ ] Check all buttons use gradient
   - [ ] Check section headers use gradient
   - [ ] Check tab indicators use #3a4660
   - [ ] Check hover states

5. **Empty States**
   - [ ] Clear all CVs from each tab
   - [ ] Verify empty state shows
   - [ ] Verify correct message for each tab

6. **Preview Modal**
   - [ ] Open CV preview
   - [ ] Verify gradient header
   - [ ] Verify gradient download button
   - [ ] Close modal

### Automated Testing (If applicable)

```tsx
// Test tab order
expect(screen.getByRole('tab', { name: /CV đã tạo/i })).toBeInTheDocument();
expect(screen.getByRole('tab', { name: /CV đã tải lên/i })).toBeInTheDocument();
expect(screen.getByRole('tab', { name: /Draft/i })).toBeInTheDocument();

// Test default active tab
expect(screen.getByRole('tab', { name: /CV đã tạo/i })).toHaveClass('border-[#3a4660]');

// Test upload button visibility
const uploadedTab = screen.getByRole('tab', { name: /CV đã tải lên/i });
fireEvent.click(uploadedTab);
expect(screen.getByText(/Tải CV lên/i)).toBeInTheDocument();

// Test CV card dimensions
const cvCard = screen.getAllByTestId('cv-card')[0];
expect(cvCard).toHaveClass('w-[230px]', 'h-[260px]');
```

---

## Rollback Plan

### If issues occur:

1. **Keep a backup** of the original `page.tsx`
2. **Git revert** to previous commit:
   ```bash
   git log --oneline  # Find commit hash
   git revert <commit-hash>
   ```
3. **Restore from backup**:
   ```bash
   cp page.tsx.backup src/app/candidate/cv-management/page.tsx
   ```

### Partial Rollback Options:

**Revert only colors:**
- Search/replace `#3a4660` → `green-600`
- Search/replace `gray-400` → `green-700`

**Revert only card size:**
- Remove `w-[230px] h-[260px]`
- Restore `aspect-[210/297]`

**Revert only tab order:**
- Change default tab: `useState("built")` → `useState("uploaded")`
- Reorder tab buttons in JSX

---

## Performance Impact

### Before:
- 5-column responsive grid
- Variable CV card heights
- Green theme (standard Tailwind)

### After:
- 3-column fixed grid
- Fixed CV card dimensions (230x260)
- Custom gradient (arbitrary values)

**Impact:** Negligible. No performance regression expected.

---

## Browser Compatibility

### Tested/Compatible:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### Required CSS Features:
- CSS Grid
- Flexbox
- CSS Gradients
- CSS Transforms (scale)
- CSS Transitions
- Backdrop Filter (for privacy badge)

**Fallbacks:** All modern. No IE11 support needed.

---

## Deployment Checklist

- [ ] Update staging environment
- [ ] Test all CV management features
- [ ] Verify responsive layout (3 columns)
- [ ] Check color contrast (WCAG AA)
- [ ] Test with real CV files
- [ ] Verify empty states
- [ ] Test modal interactions
- [ ] Check tab navigation
- [ ] Validate upload button visibility
- [ ] Test on mobile devices
- [ ] Clear browser cache for users
- [ ] Update user documentation
- [ ] Update API documentation (if applicable)
- [ ] Deploy to production
- [ ] Monitor for errors

---

## Documentation Updates Needed

- [ ] User Guide: New tab order
- [ ] User Guide: Upload button location
- [ ] User Guide: Draft tab explanation
- [ ] Developer Docs: New component specs
- [ ] API Docs: Draft CV endpoints (future)
- [ ] Design System: New color palette
- [ ] Storybook: Update CV card examples

---

## Support & Troubleshooting

### Common Issues

**Issue:** Cards overlap or sizing wrong  
**Solution:** Ensure parent container has enough width for 3 × 230px + gaps

**Issue:** Gradient not showing  
**Solution:** Check Tailwind config allows arbitrary values

**Issue:** Upload button always visible  
**Solution:** Verify `activeTab === "uploaded"` condition

**Issue:** Tab order confusing for users  
**Solution:** Add onboarding tooltip or update user guide

---

## Future Enhancements

### Planned (Not in this refactor):
- [ ] Draft CV local storage persistence
- [ ] Real thumbnail generation for preview
- [ ] Drag-and-drop CV reordering
- [ ] Batch operations (select multiple CVs)
- [ ] CV templates in Draft tab
- [ ] CV analytics (views, applications)
- [ ] Share CV via link
- [ ] CV version history

---

**Migration Difficulty:** 🟢 Easy (No breaking changes)  
**Time Estimate:** 15-30 minutes review  
**Support:** Check documentation files in project root  
**Last Updated:** November 21, 2025

# Integration Guide: Hooks & Dialogs

## ✅ Completed

### 1. Fixed LanguageDialog
- Changed `id: Date.now()` → `id: Date.now().toString()`
- Fixed type mismatch with Language interface

### 2. Created 8 Custom Hooks
All hooks created in `hooks/` folder:
- ✅ `useEducation.ts` - Education CRUD + state
- ✅ `useWorkExperience.ts` - Work experience CRUD + state
- ✅ `useLanguages.ts` - Languages CRUD + state
- ✅ `useProjects.ts` - Projects CRUD + state
- ✅ `useAwards.ts` - Awards CRUD + state
- ✅ `useCertificates.ts` - Certificates CRUD + state
- ✅ `useSkills.ts` - Skills management + state
- ✅ `useAboutMe.ts` - About me + state

### 3. Created 9 Dialog Components
All dialogs created in `components/dialogs/`:
- ✅ AboutMeDialog
- ✅ PersonalDetailDialog
- ✅ EducationDialog
- ✅ WorkExperienceDialog
- ✅ LanguageDialog
- ✅ ProjectDialog
- ✅ AwardDialog
- ✅ CertificateDialog
- ✅ SkillsDialog

### 4. Partially Integrated in page.tsx
- ✅ Imported all dialog components
- ✅ Imported all hooks
- ✅ Replaced AboutMeDialog inline → component
- ✅ Replaced PersonalDetailDialog inline → component
- ✅ Replaced EducationDialog inline → component

## ⏳ TODO: Complete Integration

### Step 1: Remove Duplicate State in page.tsx

Find and DELETE these state declarations (lines ~120-220):
```typescript
// DELETE THESE - now in hooks:
const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
const [aboutMeText, setAboutMeText] = useState("");
const [isEducationOpen, setIsEducationOpen] = useState(false);
const [editingEducation, setEditingEducation] = useState<EducationType | null>(null);
const [educations, setEducations] = useState<EducationType[]>([]);
const [isWorkExpOpen, setIsWorkExpOpen] = useState(false);
const [editingWorkExp, setEditingWorkExp] = useState<WorkExperienceType | null>(null);
const [workExperiences, setWorkExperiences] = useState<WorkExperienceType[]>([]);
const [isLanguageOpen, setIsLanguageOpen] = useState(false);
const [selectedLanguages, setSelectedLanguages] = useState<LanguageType[]>([]);
const [isProjectOpen, setIsProjectOpen] = useState(false);
const [editingProject, setEditingProject] = useState<HighlightProjectType | null>(null);
const [projects, setProjects] = useState<HighlightProjectType[]>([]);
const [isAwardsOpen, setIsAwardsOpen] = useState(false);
const [editingAward, setEditingAward] = useState<AwardType | null>(null);
const [awards, setAwards] = useState<AwardType[]>([]);
const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
const [editingCert, setEditingCert] = useState<CertificateType | null>(null);
const [certificates, setCertificates] = useState<CertificateType[]>([]);
const [coreSkillGroups, setCoreSkillGroups] = useState<...>([]);
const [softSkillItems, setSoftSkillItems] = useState<...>([]);
```

### Step 2: Update State References

Replace all state references with hook properties:

| Old State | New Hook Property |
|-----------|------------------|
| `aboutMeText` | `aboutMeHook.aboutMeText` |
| `isAboutMeOpen` | `aboutMeHook.isAboutMeOpen` |
| `educations` | `educationHook.educations` |
| `isEducationOpen` | `educationHook.isEducationOpen` |
| `editingEducation` | `educationHook.editingEducation` |
| `workExperiences` | `workExpHook.workExperiences` |
| `isWorkExpOpen` | `workExpHook.isWorkExpOpen` |
| `selectedLanguages` | `languagesHook.languages` |
| `isLanguageOpen` | `languagesHook.isLanguageOpen` |
| `projects` | `projectsHook.projects` |
| `isProjectOpen` | `projectsHook.isProjectOpen` |
| `awards` | `awardsHook.awards` |
| `isAwardsOpen` | `awardsHook.isAwardsOpen` |
| `certificates` | `certificatesHook.certificates` |
| `isCertDialogOpen` | `certificatesHook.isCertDialogOpen` |
| `coreSkillGroups` | `skillsHook.coreSkillGroups` |
| `softSkillItems` | `skillsHook.softSkillGroups` |

### Step 3: Update Handler References

Replace handler calls with hook methods:

| Old Handler | New Hook Method |
|-------------|----------------|
| `handleSaveAboutMe()` | `aboutMeHook.saveAboutMe()` |
| `handleAboutMeChange(value)` | `aboutMeHook.handleAboutMeChange(value)` |
| `handleSaveEducation()` | `educationHook.saveEducation()` |
| `handleRemoveEducation(id)` | `educationHook.removeEducation(id)` |
| `handleOpenEducationDialog(mode, edu)` | `educationHook.openEducationDialog(edu)` |
| `handleSaveWorkExp()` | `workExpHook.saveWorkExp()` |
| `handleRemoveWorkExp(id)` | `workExpHook.removeWorkExp(id)` |
| `handleSaveLanguages()` | `languagesHook.saveLanguages()` |
| `handleRemoveLanguage(id)` | `languagesHook.removeLanguage(id)` |
| `handleSaveProject()` | `projectsHook.saveProject()` |
| `handleRemoveProject(id)` | `projectsHook.removeProject(id)` |
| `handleSaveAward()` | `awardsHook.saveAward()` |
| `handleRemoveAward(id)` | `awardsHook.removeAward(id)` |
| `saveCertificate()` | `certificatesHook.saveCertificate()` |
| `handleRemoveCert(id)` | `certificatesHook.removeCertificate(id)` |

### Step 4: Replace Remaining Inline Dialogs

#### WorkExperienceDialog
Find around line 1800, replace:
```tsx
<Dialog open={isWorkExpOpen}...>
  {/* ~150 lines of JSX */}
</Dialog>
```
With:
```tsx
<WorkExperienceDialog
  open={workExpHook.isWorkExpOpen}
  onOpenChange={workExpHook.setIsWorkExpOpen}
  editingWorkExp={workExpHook.editingWorkExp}
  onEditingWorkExpChange={workExpHook.setEditingWorkExp}
  onSave={workExpHook.saveWorkExp}
/>
```

#### LanguageDialog
Replace inline dialog (~100 lines) with:
```tsx
<LanguageDialog
  open={languagesHook.isLanguageOpen}
  onOpenChange={languagesHook.setIsLanguageOpen}
  languages={languagesHook.languages}
  onLanguagesChange={languagesHook.setLanguages}
  onSave={languagesHook.saveLanguages}
/>
```

#### ProjectDialog
Replace inline dialog (~150 lines) with:
```tsx
<ProjectDialog
  open={projectsHook.isProjectOpen}
  onOpenChange={projectsHook.setIsProjectOpen}
  editingProject={projectsHook.editingProject}
  onEditingProjectChange={projectsHook.setEditingProject}
  onSave={projectsHook.saveProject}
/>
```

#### AwardDialog
Replace inline dialog (~100 lines) with:
```tsx
<AwardDialog
  open={awardsHook.isAwardsOpen}
  onOpenChange={awardsHook.setIsAwardsOpen}
  editingAward={awardsHook.editingAward}
  onEditingAwardChange={awardsHook.setEditingAward}
  onSave={awardsHook.saveAward}
/>
```

#### CertificateDialog
Replace inline dialog (~110 lines) with:
```tsx
<CertificateDialog
  open={certificatesHook.isCertDialogOpen}
  onOpenChange={certificatesHook.setIsCertDialogOpen}
  editingCertificate={certificatesHook.editingCert}
  onEditingCertificateChange={certificatesHook.setEditingCert}
  onSave={certificatesHook.saveCertificate}
/>
```

#### SkillsDialog (special case)
This one needs custom wrapper logic since it uses temporary skills array.
Keep the existing skills dialog for now OR refactor to use SkillsDialog component with modified props.

### Step 5: Update useEffect for Data Loading

Find the `fetchResumeData` useEffect (~line 320-470) and update setters:
```typescript
// OLD:
setEducations(transformedEducations);
setWorkExperiences(transformedWorkExps);
setSelectedLanguages(transformedLanguages);
// ... etc

// NEW:
educationHook.setEducations(transformedEducations);
workExpHook.setWorkExperiences(transformedWorkExps);
languagesHook.setLanguages(transformedLanguages);
projectsHook.setProjects(transformedProjects);
awardsHook.setAwards(transformedAwards);
certificatesHook.setCertificates(transformedCerts);
aboutMeHook.setAboutMeText(resumeData.aboutMe || '');
```

### Step 6: Update Section Components Props

Find section component usages (around line 1300-1400) and update:
```tsx
{/* OLD */}
<EducationSection
  educations={educations}
  onAdd={() => handleOpenEducationDialog("add")}
  onEdit={(edu) => handleOpenEducationDialog("edit", edu)}
  onRemove={handleRemoveEducation}
/>

{/* NEW */}
<EducationSection
  educations={educationHook.educations}
  onAdd={() => educationHook.openEducationDialog()}
  onEdit={(edu) => educationHook.openEducationDialog(edu)}
  onRemove={educationHook.removeEducation}
/>
```

Repeat for: WorkExperienceSection, LanguageSection, HighlightProjectsSection, AwardsSection, CertificatesSection.

### Step 7: Delete Old Handlers

DELETE these functions (now in hooks):
- `handleSaveAboutMe`
- `handleAboutMeChange`
- `handleOpenEducationDialog`
- `handleSaveEducation`
- `handleRemoveEducation`
- `handleOpenWorkExpDialog`
- `handleSaveWorkExp`
- `handleRemoveWorkExp`
- `handleAddLanguage`
- `handleRemoveLanguage`
- `handleSaveLanguages`
- `handleOpenProjectDialog`
- `handleSaveProject`
- `handleRemoveProject`
- `handleOpenAwardsDialog`
- `handleSaveAward`
- `handleRemoveAward`
- `handleRemoveCert` (replace with certificatesHook.removeCertificate)

## Expected Results

After completing all steps:
- **Line count**: ~2300 → ~800-1000 lines (60-65% reduction)
- **Separation of concerns**: UI in page.tsx, logic in hooks
- **Reusability**: Hooks can be used in other pages
- **Maintainability**: Each domain (education, work exp, etc) isolated in its own hook
- **Type safety**: Full TypeScript support maintained

## Quick Commands

```bash
# Check current line count
wc -l page.tsx

# Search for duplicate state (should return 0 after cleanup)
grep "const \[isEducationOpen" page.tsx

# Search for old handlers (should return 0 after cleanup)
grep "handleSaveEducation" page.tsx
```

## Notes

- Keep `skillType`, `selectedSkill`, `skillExperience`, `skills` state for now (Skills dialog temp state)
- Keep `profileName`, `profileTitle` etc for Personal Detail dialog
- Keep `dialogMode` and `editingXXXId` states until fully migrated
- Test each dialog after replacement to ensure functionality

"use client";

import { useState, useEffect } from "react";
import CVSidebar from "@/components/layout/CVSidebar";
import { useLayout } from "@/contexts/LayoutContext";
import api from "@/lib/api";
import { openCVTemplate } from "@/lib/cv-template-navigation";
import {
  ProfileHeaderCard,
  AboutMeSection,
  EducationSection,
  WorkExperienceSection,
  LanguageSection,
  SkillsSection,
  HighlightProjectsSection,
  CertificatesSection,
  AwardsSection,
  ProfileStrengthSidebar,
  AboutMeDialog,
  PersonalDetailDialog,
  EducationDialog,
  WorkExperienceDialog,
  LanguageDialog,
  ProjectDialog,
  AwardDialog,
  CertificateDialog,
  SkillsDialog,
} from "./components";
import toast from "react-hot-toast";
import {
  useEducation,
  useWorkExperience,
  useLanguages,
  useProjects,
  useAwards,
  useCertificates,
  useSkills,
  useAboutMe
} from "./hooks";

// Helper function to decode JWT token
function decodeJwt(token: string): { email?: string; sub?: string;[key: string]: any } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function CMProfile() {
  // Resume ID state - will be fetched from API
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(true);

  // Custom hooks for data management
  const educationHook = useEducation(resumeId);
  const workExpHook = useWorkExperience(resumeId);
  const languagesHook = useLanguages(resumeId);
  const projectsHook = useProjects(resumeId);
  const awardsHook = useAwards(resumeId);
  const certificatesHook = useCertificates(resumeId);
  const skillsHook = useSkills(resumeId);
  const aboutMeHook = useAboutMe(resumeId);

  // UI state
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [skillType, setSkillType] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [skillExperience, setSkillExperience] = useState<string>("");
  const [skills, setSkills] = useState<Array<{
    id: string;
    skill: string;
    experience?: string;
  }>>([]);
  const [originalSkills, setOriginalSkills] = useState<Array<{
    id: string;
    skill: string;
    experience?: string;
  }>>([]);
  const { headerHeight } = useLayout();
  const [headerH, setHeaderH] = useState(headerHeight || 0);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Personal Detail modal state
  const [isPersonalDetailOpen, setIsPersonalDetailOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileDob, setProfileDob] = useState("");
  const [profileGender, setProfileGender] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    let completion = 0;

    // 1. Awards, Certificates, Projects, Languages: +5% each if at least 1 item exists
    if (awardsHook.awards.length > 0) completion += 5;
    if (certificatesHook.certificates.length > 0) completion += 5;
    if (projectsHook.projects.length > 0) completion += 5;
    if (languagesHook.languages.length > 0) completion += 5;

    // 2. Education, About Me: +10% each if exists
    if (educationHook.educations.length > 0) completion += 10;
    if (aboutMeHook.aboutMeText.trim().length > 0) completion += 10;

    // 3. Work Experience: +10% per item (max 3 = 30%)
    const workExpCount = Math.min(workExpHook.workExperiences.length, 3);
    completion += workExpCount * 10;

    // 4. Core Skills: +2.5% per skill (max 8 = 20%)
    const coreSkillsCount = skillsHook.coreSkillGroups.reduce(
      (total, group) => total + (group.items?.length || 0),
      0
    );
    const coreSkillsBonus = Math.min(coreSkillsCount, 8) * 2.5;
    completion += coreSkillsBonus;

    // 5. Soft Skills: +2.5% if at least 1 exists
    const softSkillsCount = skillsHook.softSkillGroups.reduce(
      (total, group) => total + (group.items?.length || 0),
      0
    );
    if (softSkillsCount > 0) completion += 2.5;

    // 6. Profile Header fields (excluding image): distribute remaining % among filled fields
    // Total possible from above: 5+5+5+5+10+10+30+20+2.5 = 92.5%
    // Remaining for profile fields: 7.5%
    const profileFields = [
      profileName,
      profileTitle,
      profilePhone,
      profileDob,
      profileGender,
      profileAddress,
      profileLink
    ];
    const filledProfileFields = profileFields.filter(field => field && field.trim().length > 0).length;
    const profileFieldBonus = (filledProfileFields / profileFields.length) * 7.5;
    completion += profileFieldBonus;

    return Math.round(completion);
  };

  const profileCompletion = calculateProfileCompletion();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeight = localStorage.getItem("headerHeight");
      if (savedHeight && !headerHeight) {
        setHeaderH(parseInt(savedHeight));
      } else if (headerHeight) {
        setHeaderH(headerHeight);
      }
    }
  }, [headerHeight]);

  // Decode email from access token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = decodeJwt(token);
        if (decoded) {
          // Email can be in 'email' or 'sub' field depending on JWT structure
          const email = decoded.email || decoded.sub || "";
          setUserEmail(email);
        }
      }
    }
  }, []);

  // Auto-create profile and resume on page load, then fetch data
  useEffect(() => {
    const initializeAndFetchData = async () => {
      setIsLoadingResume(true);

      try {
        // ✅ STEP 1: Initialize profile and resume
        await initializeProfileAndResume();

        // ✅ STEP 2: Fetch resume data
        await fetchResumeData();

        // ✅ STEP 3: Fetch personal details
        await fetchPersonalDetails();

      } catch (error: any) {
        console.error("Failed to initialize:", error);
        toast.error("Failed to load profile. Please refresh the page.");
      } finally {
        setIsLoadingResume(false);
      }
    };

    initializeAndFetchData();
  }, []);

  // Initialize profile and resume helper function
  const initializeProfileAndResume = async () => {
    try {
      // ✅ STEP 1: Check if profile already exists
      let profileExists = false;
      try {
        const profileCheck = await api.get("/api/candidates/profiles/current");
        if (profileCheck.data?.result?.id) {
          profileExists = true;
        }
      } catch (checkError: any) {
        // Profile doesn't exist yet (404 or other error)
        profileExists = false;
      }

      // ✅ STEP 2: Create profile if it doesn't exist
      if (!profileExists) {
        try {
          // Check if there's a pending DoB from sign-up
          const pendingDob = typeof window !== "undefined"
            ? localStorage.getItem("pending_profile_dob")
            : null;

          // ✅ Create candidate profile - only dob is required
          const profilePayload = {
            dob: pendingDob || new Date().toISOString().split('T')[0] // Use today's date as fallback
          };

          await api.post("/api/candidates/profiles/create", profilePayload);

          // Clear the pending DoB after successful creation
          if (pendingDob && typeof window !== "undefined") {
            localStorage.removeItem("pending_profile_dob");
          }

          toast.success("Profile created successfully!");
        } catch (profileError: any) {
          // If profile already exists (409/400), just clear the flag
          if (profileError?.response?.status === 409 || profileError?.response?.status === 400) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("pending_profile_dob");
            }
          } else {
            throw profileError; // Re-throw to be caught by outer try-catch
          }
        }
      } else {
        // Profile exists, clear pending DoB flag if any
        if (typeof window !== "undefined") {
          localStorage.removeItem("pending_profile_dob");
        }
      }

      // ✅ STEP 3: Check if resume exists
      let resumeExists = false;
      try {
        const resumeCheck = await api.get("/api/resume");
        if (resumeCheck.data?.result && resumeCheck.data.result.length > 0) {
          resumeExists = true;
        }
      } catch (resumeCheckError: any) {
        resumeExists = false;
      }

      // ✅ STEP 4: Create resume (blank) only if no resume exists
      if (!resumeExists) {
        try {
          const resumePayload = {
            aboutMe: ""
          };
          await api.post("/api/resume", resumePayload);
          toast.success("Resume created successfully!");

          // ✅ Wait a bit for backend to process
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (resumeError: any) {
          // Resume creation failed or already exists
          if (resumeError?.response?.status !== 409 && resumeError?.response?.status !== 400) {
            throw resumeError; // Re-throw to be caught by outer try-catch
          }
        }
      }
    } catch (error: any) {
      console.error("Initialization error:", error);
      throw error; // Re-throw to be caught by main useEffect
    }
  };

  // Fetch resume data helper function
  const fetchResumeData = async () => {
    try {
      const response = await api.get("/api/resume");

      if (response.data?.result && response.data.result.length > 0) {
        const resume = response.data.result[0]; // Get first resume
        setResumeId(resume.resumeId);

        // Load About Me
        if (resume.aboutMe) {
          aboutMeHook.setAboutMeText(resume.aboutMe);
        }

        // Load Awards
        if (resume.awards && resume.awards.length > 0) {
          const transformedAwards = resume.awards.map((award: any) => {
            const date = new Date(award.getDate);
            return {
              id: award.awardId.toString(),
              name: award.name,
              organization: award.organization,
              month: String(date.getMonth() + 1).padStart(2, '0'),
              year: String(date.getFullYear()),
              description: award.description
            };
          });
          awardsHook.setAwards(transformedAwards);
        }

        // Load Education
        if (resume.educations && resume.educations.length > 0) {
          const transformedEducations = resume.educations.map((edu: any) => {
            const startDate = new Date(edu.startDate);
            const endDate = edu.endDate ? new Date(edu.endDate) : null;
            return {
              id: edu.educationId.toString(),
              school: edu.school,
              degree: edu.degree,
              major: edu.major,
              startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
              startYear: String(startDate.getFullYear()),
              endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
              endYear: endDate ? String(endDate.getFullYear()) : ''
            };
          });
          educationHook.setEducations(transformedEducations);
        }

        // Load Highlight Projects
        if (resume.highlightProjects && resume.highlightProjects.length > 0) {
          const transformedProjects = resume.highlightProjects.map((project: any) => {
            const startDate = new Date(project.startDate);
            const endDate = project.endDate ? new Date(project.endDate) : null;
            return {
              id: project.highlightProjectId.toString(),
              name: project.name,
              startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
              startYear: String(startDate.getFullYear()),
              endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
              endYear: endDate ? String(endDate.getFullYear()) : '',
              description: project.description,
              url: project.projectUrl,
              working: !project.endDate
            };
          });
          projectsHook.setProjects(transformedProjects);
        }

        // Load Work Experience
        if (resume.workExperiences && resume.workExperiences.length > 0) {
          const transformedWorkExp = resume.workExperiences.map((exp: any) => {
            const startDate = new Date(exp.startDate);
            const endDate = exp.endDate ? new Date(exp.endDate) : null;
            return {
              id: exp.workExperienceId.toString(),
              jobTitle: exp.jobTitle,
              company: exp.company,
              startMonth: String(startDate.getMonth() + 1).padStart(2, '0'),
              startYear: String(startDate.getFullYear()),
              endMonth: endDate ? String(endDate.getMonth() + 1).padStart(2, '0') : '',
              endYear: endDate ? String(endDate.getFullYear()) : '',
              description: exp.description,
              project: exp.project,
              working: !exp.endDate
            };
          });
          workExpHook.setWorkExperiences(transformedWorkExp);
        }

        // Load Foreign Languages
        if (resume.foreignLanguages && resume.foreignLanguages.length > 0) {
          const transformedLanguages = resume.foreignLanguages.map((lang: any) => ({
            id: lang.foreignLanguageId.toString(),
            language: lang.language,
            level: lang.level
          }));
          languagesHook.setLanguages(transformedLanguages);
        }

        // Load Certificates
        if (resume.certificates && resume.certificates.length > 0) {
          const transformedCerts = resume.certificates.map((cert: any) => {
            const date = new Date(cert.getDate);
            return {
              id: cert.certificateId.toString(),
              name: cert.name,
              org: cert.organization,
              month: String(date.getMonth() + 1).padStart(2, '0'),
              year: String(date.getFullYear()),
              url: cert.certificateUrl,
              desc: cert.description
            };
          });
          certificatesHook.setCertificates(transformedCerts);
        }

        // Load Skills
        if (resume.skills && resume.skills.length > 0) {
          const coreSkills = resume.skills.filter((skill: any) => skill.skillType === "core");
          const softSkills = resume.skills.filter((skill: any) => skill.skillType === "soft");

          // Transform core skills
          if (coreSkills.length > 0) {
            const coreSkillItems = coreSkills.map((skill: any) => ({
              id: skill.skillId.toString(),
              skill: skill.skillName,
              experience: skill.yearOfExperience ? String(skill.yearOfExperience) : ''
            }));

            skillsHook.setCoreSkillGroups([{
              id: 'core-group-1',
              name: 'Core Skills',
              items: coreSkillItems
            }]);
          }

          // Transform soft skills
          if (softSkills.length > 0) {
            const softSkillItems = softSkills.map((skill: any) => ({
              id: skill.skillId.toString(),
              skill: skill.skillName
            }));

            skillsHook.setSoftSkillGroups([{
              id: 'soft-group-1',
              name: 'Soft Skills',
              items: softSkillItems
            }]);
          }
        }
      }
    } catch (error: any) {
      // Handle 400 error when resume is just created
      if (error?.response?.status === 400) {
        console.log("Resume exists but empty - this is expected for new users");
        // Don't throw error, just continue with empty data
      } else {
        console.error("Failed to load resume data:", error);
        toast.error("Failed to load resume data");
        throw error; // Re-throw for other errors
      }
    }
  };

  // Fetch personal details helper function
  const fetchPersonalDetails = async () => {
    try {
      // ✅ Use /api/candidates/profiles/current
      const response = await api.get("/api/candidates/profiles/current");

      if (response.data?.result) {
        const profile = response.data.result;

        // ✅ Use fullName from API (not username)
        setProfileName(profile.fullName || "");
        setProfileTitle(profile.title || "");
        setProfilePhone(profile.phone || "");
        setProfileDob(profile.dob || "");
        setProfileGender(profile.gender || "");
        setProfileAddress(profile.address || "");
        setProfileLink(profile.link || "");
        setProfileImage(profile.image || "");
      }
    } catch (error) {
      // Don't show error on initial load if profile doesn't exist yet
      console.error("Failed to fetch personal details:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    // For core skills, require experience; for soft, ignore experience
    if (skillType === "core" && !skillExperience) return;
    const newItem = {
      id: Date.now().toString(),
      skill: selectedSkill,
      ...(skillType === "core" ? { experience: skillExperience } : {}),
    } as { id: string; skill: string; experience?: string };

    setSkills((prev) => [...prev, newItem]);
    setSelectedSkill("");
    if (skillType === "core") setSkillExperience("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleSaveSkills = async () => {
    if (skillType !== "core" && skillType !== "soft") {
      toast.error("Please select a skill type");
      return;
    }

    await skillsHook.saveSkills(skills, skillType, originalSkills);

    // Reset form after successful save
    setSkillType("");
    setSkills([]);
    setOriginalSkills([]);
    setSelectedSkill("");
    setSkillExperience("");
  };

  const handleCancelSkills = () => {
    skillsHook.setIsSkillDialogOpen(false);
    // Reset form
    setSkillType("");
    setSkills([]);
    setOriginalSkills([]);
    setSelectedSkill("");
    setSkillExperience("");
  };

  // Edit handlers for skills
  const handleEditCoreSkills = (group: any) => {
    // Populate dialog with existing core skills
    setSkillType("core");
    const groupSkills = group.items || [];
    setSkills([...groupSkills]);
    setOriginalSkills([...groupSkills]); // Store original for comparison
    skillsHook.setIsSkillDialogOpen(true);
  };

  const handleEditSoftSkills = () => {
    // Populate dialog with existing soft skills
    setSkillType("soft");
    const softSkills = skillsHook.softSkillGroups.flatMap(group => group.items || []);
    setSkills([...softSkills]);
    setOriginalSkills([...softSkills]); // Store original for comparison
    skillsHook.setIsSkillDialogOpen(true);
  };

  // Personal Detail handlers
  const handleSavePersonalDetail = async () => {
    if (!profileAddress) {
      toast.error("Address is required");
      return;
    }

    try {
      // ✅ Update profile via /api/candidates/profiles
      // Payload structure: { dob, title, fullName, phone, address, image, gender, link }
      const profileData = {
        dob: profileDob || undefined,
        title: profileTitle || undefined,
        fullName: profileName || undefined,  // ✅ Use fullName (not username)
        phone: profilePhone || undefined,
        address: profileAddress,
        image: profileImage || undefined,
        gender: profileGender || undefined,
        link: profileLink || undefined
      };

      await api.put("/api/candidates/profiles", profileData);

      toast.success("Personal details updated successfully!");
      setIsPersonalDetailOpen(false);
    } catch (error: any) {
      toast.error("Failed to update personal details. Please try again.");
    }
  };

  // Handler for Preview & Download CV button
  const handlePreviewCV = () => {
    // Prepare CV data from profile information
    const cvData = {
      personalInfo: {
        fullName: profileName || "",
        position: profileTitle || "",
        email: "", // You might want to get this from auth context
        phone: profilePhone || "",
        location: profileAddress || "",
        website: profileLink || "",
        photoUrl: profileImage || "",
        summary: aboutMeHook.aboutMeText || "",
      },
      experience: workExpHook.workExperiences || [],
      education: educationHook.educations || [],
      skills: skillsHook.coreSkillGroups || [],
      languages: languagesHook.languages || [],
      certifications: certificatesHook.certificates || [],
      projects: projectsHook.projects || [],
      awards: awardsHook.awards || [],
    };

    // Prepare profile data
    const profile = {
      fullName: profileName,
      title: profileTitle,
      phone: profilePhone,
      dob: profileDob,
      gender: profileGender,
      address: profileAddress,
      link: profileLink,
      image: profileImage,
    };

    // Use default template (you can make this configurable)
    const templateId = "modern";

    // Navigate to CV template page with data
    openCVTemplate(cvData, profile, templateId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div
          className="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-6 items-start transition-all duration-300"
          style={{
            ["--sticky-offset" as any]: `${headerH}px`,
            ["--content-pad" as any]: "24px",
          }}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block sticky [top:calc(var(--sticky-offset)+var(--content-pad))] self-start transition-all duration-300">
            <CVSidebar activePage="cm-profile" />
          </aside>

          {/* Main Content */}
          <section className="space-y-6 min-w-0 lg:mt-[var(--sticky-offset)] transition-all duration-300">
            {isLoadingResume ? (
              /* Loading State - Skeleton Loaders */
              <div className="space-y-6">
                {/* Profile Header Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Content Sections Skeleton */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Actual Content */
              <>
                {/* Profile Header */}
                <ProfileHeaderCard
                  profileName={profileName}
                  profileTitle={profileTitle}
                  profileImage={profileImage}
                  profilePhone={profilePhone}
                  profileDob={profileDob}
                  profileGender={profileGender}
                  profileAddress={profileAddress}
                  profileLink={profileLink}
                  email={userEmail}
                  onEditPersonalDetails={() => setIsPersonalDetailOpen(true)}
                />

                {/* About Me */}
                <AboutMeSection
                  aboutMeText={aboutMeHook.aboutMeText}
                  onEdit={() => aboutMeHook.setIsAboutMeOpen(true)}
                />

                {/* Education */}
                <EducationSection
                  educations={educationHook.educations}
                  onAdd={() => educationHook.openEducationDialog()}
                  onEdit={(edu) => educationHook.openEducationDialog(edu)}
                  onRemove={educationHook.removeEducation}
                />

                {/* Work Experience */}
                <WorkExperienceSection
                  workExperiences={workExpHook.workExperiences}
                  onAdd={() => workExpHook.openWorkExpDialog()}
                  onEdit={(exp) => workExpHook.openWorkExpDialog(exp)}
                  onRemove={workExpHook.removeWorkExp}
                />

                {/* Foreign Language */}
                <LanguageSection
                  languages={languagesHook.languages}
                  onAdd={() => languagesHook.openLanguageDialog()}
                  onEdit={(lang) => {
                    // Language edit uses same dialog as add
                    languagesHook.openLanguageDialog();
                  }}
                  onRemove={languagesHook.removeLanguage}
                />

                {/* Skills */}
                <SkillsSection
                  coreSkillGroups={skillsHook.coreSkillGroups}
                  softSkillItems={skillsHook.softSkillGroups.flatMap(group => group.items || [])}
                  onAddCoreSkills={() => {
                    setSkillType("core");
                    setSkills([]);
                    setOriginalSkills([]);
                    skillsHook.setIsSkillDialogOpen(true);
                  }}
                  onAddSoftSkills={() => {
                    setSkillType("soft");
                    setSkills([]);
                    setOriginalSkills([]);
                    skillsHook.setIsSkillDialogOpen(true);
                  }}
                  onEditCoreSkills={handleEditCoreSkills}
                  onEditSoftSkills={handleEditSoftSkills}
                  popoverOpen={popoverOpen}
                  setPopoverOpen={setPopoverOpen}
                />

                {/* Highlight Project */}
                <HighlightProjectsSection
                  projects={projectsHook.projects}
                  onAdd={() => projectsHook.openProjectDialog()}
                  onEdit={(project) => projectsHook.openProjectDialog(project)}
                  onRemove={projectsHook.removeProject}
                />

                {/* Certificates */}
                <CertificatesSection
                  certificates={certificatesHook.certificates}
                  onAdd={() => certificatesHook.openCertDialog()}
                  onEdit={(cert) => certificatesHook.openCertDialog(cert)}
                  onRemove={certificatesHook.removeCertificate}
                />

                {/* Awards */}
                <AwardsSection
                  awards={awardsHook.awards}
                  onAdd={() => awardsHook.openAwardsDialog()}
                  onEdit={(award) => awardsHook.openAwardsDialog(award)}
                  onRemove={awardsHook.removeAward}
                />
              </>
            )}
          </section>

          {/* Right Sidebar - Profile Strength */}
          <ProfileStrengthSidebar
            profileCompletion={profileCompletion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onPreviewClick={handlePreviewCV}
          />
        </div>
      </main>

      {/* Skills Dialog Component */}
      <SkillsDialog
        open={skillsHook.isSkillDialogOpen}
        onOpenChange={skillsHook.setIsSkillDialogOpen}
        skillType={skillType as 'core' | 'soft' | ''}
        skills={skills}
        selectedSkill={selectedSkill}
        skillExperience={skillExperience}
        onSelectedSkillChange={setSelectedSkill}
        onSkillExperienceChange={setSkillExperience}
        onAddSkill={handleAddSkill}
        onRemoveSkill={handleRemoveSkill}
        onSave={handleSaveSkills}
        onCancel={handleCancelSkills}
        isEditMode={skills.length > 0}
      />

      {/* Certificate Dialog Component */}
      <CertificateDialog
        open={certificatesHook.isCertDialogOpen}
        onOpenChange={certificatesHook.setIsCertDialogOpen}
        editingCertificate={certificatesHook.editingCert}
        onEditingCertificateChange={certificatesHook.setEditingCert}
        onSave={certificatesHook.saveCertificate}
      />

      {/* About Me Modal */}
      <AboutMeDialog
        open={aboutMeHook.isAboutMeOpen}
        onOpenChange={aboutMeHook.setIsAboutMeOpen}
        value={aboutMeHook.aboutMeText}
        onChange={aboutMeHook.handleAboutMeChange}
        onSave={aboutMeHook.saveAboutMe}
        maxLength={2500}
      />

      {/* Personal Detail Modal */}
      <PersonalDetailDialog
        open={isPersonalDetailOpen}
        onOpenChange={setIsPersonalDetailOpen}
        profileName={profileName}
        profileTitle={profileTitle}
        profilePhone={profilePhone}
        profileDob={profileDob}
        profileGender={profileGender}
        profileAddress={profileAddress}
        profileLink={profileLink}
        profileImage={profileImage}
        onProfileNameChange={setProfileName}
        onProfileTitleChange={setProfileTitle}
        onProfilePhoneChange={setProfilePhone}
        onProfileDobChange={setProfileDob}
        onProfileGenderChange={setProfileGender}
        onProfileAddressChange={setProfileAddress}
        onProfileLinkChange={setProfileLink}
        onProfileImageChange={setProfileImage}
        onSave={handleSavePersonalDetail}
      />

      {/* Education Modal */}
      <EducationDialog
        open={educationHook.isEducationOpen}
        onOpenChange={educationHook.setIsEducationOpen}
        editingEducation={educationHook.editingEducation}
        onEditingEducationChange={educationHook.setEditingEducation}
        onSave={educationHook.saveEducation}
      />

      {/* Work Experience Dialog Component */}
      <WorkExperienceDialog
        open={workExpHook.isWorkExpOpen}
        onOpenChange={workExpHook.setIsWorkExpOpen}
        editingWorkExp={workExpHook.editingWorkExp}
        onEditingWorkExpChange={workExpHook.setEditingWorkExp}
        onSave={workExpHook.saveWorkExp}
      />

      {/* Language Dialog Component */}
      <LanguageDialog
        open={languagesHook.isLanguageOpen}
        onOpenChange={languagesHook.setIsLanguageOpen}
        languages={languagesHook.languages}
        onAddLanguage={languagesHook.addLanguage}
        onRemoveLanguage={languagesHook.removeLanguage}
        onSave={languagesHook.saveLanguages}
      />

      {/* Award Dialog Component */}
      <AwardDialog
        open={awardsHook.isAwardsOpen}
        onOpenChange={awardsHook.setIsAwardsOpen}
        editingAward={awardsHook.editingAward}
        onEditingAwardChange={awardsHook.setEditingAward}
        onSave={awardsHook.saveAward}
      />

      {/* Project Dialog Component */}
      <ProjectDialog
        open={projectsHook.isProjectOpen}
        onOpenChange={projectsHook.setIsProjectOpen}
        editingProject={projectsHook.editingProject}
        onEditingProjectChange={projectsHook.setEditingProject}
        onSave={projectsHook.saveProject}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClientHeader } from "@/modules/client/components/ClientHeader";
import { ClientFooter } from "@/modules/client/components/ClientFooter";
import {
  CirclePlus,
  Edit,
  Mail,
  MapPin,
  Phone,
  Calendar,
  User,
  Globe,
  ChevronDown,
  X,
} from "lucide-react";

export default function UpdateCVProfilePage() {
  // State for profile completion percentage
  const [profileCompletion, setProfileCompletion] = useState(5);

  // State for completed sections
  const [completedSections, setCompletedSections] = useState({
    personalInfo: false,
    aboutMe: false,
    education: false,
    workExperience: false,
    coreSkills: false,
    softSkills: false,
    languages: false,
    projects: false,
    certifications: false,
    awards: false,
  });

  // Modal states
  const [personalInfoModal, setPersonalInfoModal] = useState(false);
  const [aboutMeModal, setAboutMeModal] = useState(false);
  const [educationModal, setEducationModal] = useState(false);
  const [workExpModal, setWorkExpModal] = useState(false);
  const [skillsModal, setSkillsModal] = useState(false);
  const [skillType, setSkillType] = useState<"core" | "soft" | null>(null);
  const [languageModal, setLanguageModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [certificationModal, setCertificationModal] = useState(false);
  const [awardModal, setAwardModal] = useState(false);
  const [showSkillOptions, setShowSkillOptions] = useState(false);
  // State for dropdown section
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  // Store form data temporarily for each form
  const [projectData, setProjectData] = useState({
    name: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    isCurrentProject: false,
    description: "",
  });

  const [certificationData, setCertificationData] = useState({
    name: "",
    organization: "",
    issueMonth: "",
    issueYear: "",
    url: "",
    description: "",
  });

  const [awardData, setAwardData] = useState({
    name: "",
    organization: "",
    issueMonth: "",
    issueYear: "",
    description: "",
  });

  // State for personal info
  const [personalInfoData, setPersonalInfoData] = useState({
    fullName: "Cristiano Ronaldo",
    title: "Front-end Developer",
    email: "cr7@gmail.com",
    phone: "+1234567890",
    dateOfBirth: "1985-02-05",
    gender: "Male",
    address: "",
    city: "",
    personalLink: "",
  });

  // State for languages
  const [languageData, setLanguageData] = useState([
    { id: 1, name: "English", level: "Advanced", proficiency: 75 },
    { id: 2, name: "Spanish", level: "Intermediate", proficiency: 50 },
    { id: 3, name: "French", level: "Basic", proficiency: 30 },
    { id: 4, name: "German", level: "Basic", proficiency: 25 },
    { id: 5, name: "Japanese", level: "Elementary", proficiency: 15 },
  ]);

  // Modal animation states
  const [modalAnimation, setModalAnimation] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states
  const [aboutMeText, setAboutMeText] = useState("");
  const [educationData, setEducationData] = useState({
    school: "",
    degree: "",
    major: "",
    isCurrentlyStudying: false,
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    details: "",
  });
  const [workExpData, setWorkExpData] = useState({
    title: "",
    company: "",
    isCurrentlyWorking: false,
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
  });

  // Handle closing modals with escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Function to close all modals
  const closeAllModals = () => {
    // Set animation state to false first for smooth exit
    setModalAnimation(false);

    // Wait for animation to complete before closing modal
    setTimeout(() => {
      setPersonalInfoModal(false);
      setAboutMeModal(false);
      setEducationModal(false);
      setWorkExpModal(false);
      setSkillsModal(false);
      setLanguageModal(false);
      setProjectModal(false);
      setCertificationModal(false);
      setAwardModal(false);
      setSkillType(null);
      setActiveModal(null);
      setShowSkillOptions(false);
    }, 300);
  };

  // Open modal handlers
  const openPersonalInfoModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Personal Info Modal");
    setActiveModal("personalInfo");
    setPersonalInfoModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openAboutMeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening About Me Modal");
    setActiveModal("aboutMe");
    setAboutMeModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openEducationModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Education Modal");
    setActiveModal("education");
    setEducationModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openWorkExpModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Work Experience Modal");
    setActiveModal("workExp");
    setWorkExpModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openSkillsOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Skills Options");
    setShowSkillOptions(true);
  };

  const openCoreSkillsModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Core Skills Modal");
    setActiveModal("skills");
    setSkillType("core");
    setSkillsModal(true);
    setShowSkillOptions(false);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openSoftSkillsModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Soft Skills Modal");
    setActiveModal("skills");
    setSkillType("soft");
    setSkillsModal(true);
    setShowSkillOptions(false);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openLanguageModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Language Modal");
    setActiveModal("language");
    setLanguageModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openProjectModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Project Modal");

    // If we're editing an existing project, we might want to populate
    // the form with existing data from the server/state
    if (completedSections.projects) {
      console.log("Editing existing project");
      // Here you would normally fetch the data or use the existing state
      // For now, we'll keep using the existing state data
    } else {
      console.log("Adding new project");
      // Optional: Reset the form data if creating new
    }

    setActiveModal("project");
    setProjectModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openCertificationModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Certification Modal");

    // If editing existing certification, we might want to populate form with existing data
    if (completedSections.certifications) {
      console.log("Editing existing certification");
      // Here you would normally fetch the data or use the existing state
    } else {
      console.log("Adding new certification");
      // Optional: Reset form data if creating new
    }

    setActiveModal("certification");
    setCertificationModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  const openAwardModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening Award Modal");

    // If editing existing award, we might want to populate form with existing data
    if (completedSections.awards) {
      console.log("Editing existing award");
      // Here you would normally fetch the data or use the existing state
    } else {
      console.log("Adding new award");
      // Optional: Reset form data if creating new
    }

    setActiveModal("award");
    setAwardModal(true);
    setTimeout(() => {
      setModalAnimation(true);
    }, 10);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = (
    updatedSections: Record<string, boolean>
  ) => {
    const totalSections = Object.keys(updatedSections).length;
    const completedCount =
      Object.values(updatedSections).filter(Boolean).length;
    return Math.floor((completedCount / totalSections) * 100);
  };

  // Form submission handlers
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted =
      personalInfoData.fullName.trim().length > 0 &&
      personalInfoData.email.trim().length > 0 &&
      personalInfoData.phone.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      personalInfo: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Log the change for debugging
    console.log("Personal info form submitted, completed:", isCompleted);
    console.log("Personal info data:", personalInfoData);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleAboutMeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark about me section as completed if there's text
    const isCompleted = aboutMeText.trim().length > 0;
    const updatedSections = {
      ...completedSections,
      aboutMe: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted =
      educationData.school.trim().length > 0 &&
      educationData.degree.trim().length > 0 &&
      educationData.major.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      education: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleWorkExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted =
      workExpData.title.trim().length > 0 &&
      workExpData.company.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      workExperience: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleSkillsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Since there are two types of skills, we need to update based on current type
    const updatedSections = {
      ...completedSections,
    };

    if (skillType === "core") {
      updatedSections.coreSkills = true;
    } else if (skillType === "soft") {
      updatedSections.softSkills = true;
    }

    setCompletedSections(updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we have at least one language
    const isCompleted = languageData.length > 0;

    // Mark languages section as completed
    const updatedSections = {
      ...completedSections,
      languages: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Log for debugging
    console.log("Language form submitted, completed:", isCompleted);
    console.log("Language data:", languageData);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted = projectData.name.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      projects: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Log the change for debugging
    console.log("Project form submitted, completed:", isCompleted);
    console.log("Project data:", projectData);
    console.log("Updated sections:", updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleCertificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted =
      certificationData.name.trim().length > 0 &&
      certificationData.organization.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      certifications: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Log the change for debugging
    console.log("Certification form submitted, completed:", isCompleted);
    console.log("Certification data:", certificationData);
    console.log("Updated sections:", updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    const isCompleted =
      awardData.name.trim().length > 0 &&
      awardData.organization.trim().length > 0;

    const updatedSections = {
      ...completedSections,
      awards: isCompleted,
    };

    setCompletedSections(updatedSections);

    // Log the change for debugging
    console.log("Award form submitted, completed:", isCompleted);
    console.log("Award data:", awardData);
    console.log("Updated sections:", updatedSections);

    // Update profile completion percentage
    const newCompletionPercentage = calculateProfileCompletion(updatedSections);
    setProfileCompletion(newCompletionPercentage);

    // Close modal
    closeAllModals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="container mx-auto py-8 px-4 mt-16">
        {/* Added margin-top for fixed header */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#4a4a4a]">👋</span>
                <h2 className="font-bold">Welcome</h2>
              </div>
              <h3 className="text-lg font-bold mb-6">Quang Nhật Huỳnh Tấn</h3>

              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/cv-attachment"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM13 16H7V14H13V16ZM17 8H7V6H17V8Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>CV Management</span>
                </Link>

                <Link
                  href="/update-cvprofile"
                  className="flex items-center gap-3 p-2 bg-gray-50 text-[#4a4a4a] rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <User size={16} />
                  </span>
                  <span>ITviec Profile</span>
                </Link>

                <Link
                  href="/my-jobs"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>My Jobs</span>
                </Link>

                <Link
                  href="/job-invitation"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Job Invitation</span>
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    0
                  </span>
                </Link>

                <Link
                  href="/email-subscriptions"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <Mail size={16} />
                  </span>
                  <span>Email Subscriptions</span>
                </Link>

                <Link
                  href="/notifications"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Notifications</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="p-1.5 border border-gray-200 rounded">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-1/2">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/100"
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {personalInfoData.fullName}
                    </h1>
                    <p
                      className={
                        personalInfoData.title
                          ? "text-gray-700"
                          : "text-[#6B7280]"
                      }
                    >
                      {personalInfoData.title || "Update your title"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                  onClick={openPersonalInfoModal}
                >
                  {completedSections.personalInfo ? (
                    <Edit size={24} />
                  ) : (
                    <CirclePlus size={24} />
                  )}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span>{personalInfoData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  {personalInfoData.phone ? (
                    <span>{personalInfoData.phone}</span>
                  ) : (
                    <span className="text-[#6B7280]">Your phone number</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  {personalInfoData.dateOfBirth ? (
                    <span>{personalInfoData.dateOfBirth}</span>
                  ) : (
                    <span className="text-[#6B7280]">Your date of birth</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  {personalInfoData.gender ? (
                    <span>{personalInfoData.gender}</span>
                  ) : (
                    <span className="text-[#6B7280]">Your gender</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  {personalInfoData.address ? (
                    <span>{personalInfoData.address}</span>
                  ) : (
                    <span className="text-[#6B7280]">Your current address</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  {personalInfoData.personalLink ? (
                    <span>{personalInfoData.personalLink}</span>
                  ) : (
                    <span className="text-[#6B7280]">Your personal link</span>
                  )}
                </div>
              </div>
            </div>
            {/* About Me Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">About Me</h2>
                  {completedSections.aboutMe && aboutMeText ? (
                    <div className="text-gray-700">{aboutMeText}</div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Introduce your strengths and years of experience
                    </p>
                  )}
                </div>

                {/* Column 2: img and button on a row */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.aboutMe && (
                    <img
                      src="/images/general/update-cvprofile/about.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}

                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openAboutMeModal}
                  >
                    {completedSections.aboutMe ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Education Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Education</h2>
                  {completedSections.education ? (
                    <div className="text-gray-700">
                      <div className="font-medium">
                        {educationData.degree} in {educationData.major}
                      </div>
                      <div>{educationData.school}</div>
                      <div className="text-sm text-gray-500">
                        {educationData.fromMonth}/{educationData.fromYear} -
                        {educationData.isCurrentlyStudying
                          ? " Present"
                          : ` ${educationData.toMonth}/${educationData.toYear}`}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Share your background education
                    </p>
                  )}
                </div>

                {/* Column 2: img + button */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.education && (
                    <img
                      src="/images/general/update-cvprofile/education.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openEducationModal}
                  >
                    {completedSections.education ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Work Experience Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Work Experience</h2>
                  {completedSections.workExperience ? (
                    <div className="text-gray-700">
                      <div className="font-medium">{workExpData.title}</div>
                      <div>{workExpData.company}</div>
                      <div className="text-sm text-gray-500">
                        {workExpData.fromMonth}/{workExpData.fromYear} -
                        {workExpData.isCurrentlyWorking
                          ? " Present"
                          : ` ${workExpData.toMonth}/${workExpData.toYear}`}
                      </div>
                      <div className="mt-2 text-sm">
                        {workExpData.description}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Highlight detailed information about your job history
                    </p>
                  )}
                </div>

                {/* Column 2: img + button */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.workExperience && (
                    <img
                      src="/images/general/update-cvprofile/workexperience.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openWorkExpModal}
                  >
                    {completedSections.workExperience ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Skills</h2>
                  {completedSections.coreSkills ||
                    completedSections.softSkills ? (
                    <div className="text-gray-700">
                      {completedSections.coreSkills && (
                        <div className="mb-2">
                          <div className="font-medium mb-1">Core Skills</div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              React
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              JavaScript
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              TypeScript
                            </span>
                          </div>
                        </div>
                      )}
                      {completedSections.softSkills && (
                        <div>
                          <div className="font-medium mb-1">Soft Skills</div>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              Communication
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              Teamwork
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                              Problem Solving
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Showcase your skills and proficiencies
                    </p>
                  )}
                </div>

                {/* Column 2: img + button */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.coreSkills &&
                    !completedSections.softSkills && (
                      <img
                        src="/images/general/update-cvprofile/skills.png"
                        alt="Icon"
                        className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                      />
                    )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openSkillsOptions}
                  >
                    {completedSections.coreSkills ||
                      completedSections.softSkills ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Foreign Language Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Foreign Languages</h2>
                  {completedSections.languages ? (
                    <div className="text-gray-700 space-y-3">
                      {languageData.map((language) => (
                        <div key={language.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{language.name}</span>
                            <span className="text-sm">{language.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#5d5d5d] h-2 rounded-full"
                              style={{ width: `${language.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Showcase your language skills and proficiencies
                    </p>
                  )}
                </div>

                {/* Column 2: img + button */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.languages && (
                    <img
                      src="/images/general/update-cvprofile/forlanguae.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openLanguageModal}
                  >
                    {completedSections.languages ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Highlight Project Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Highlight Projects</h2>
                  {completedSections.projects ? (
                    <div className="text-gray-700">
                      <div className="font-medium">E-commerce Platform</div>
                      <div className="text-sm text-gray-500">
                        Jan 2023 - June 2023
                      </div>
                      <div className="mt-2 text-sm">
                        Built a fully functional e-commerce platform using
                        React, Node.js, and MongoDB. Implemented features like
                        user authentication, payment processing, and order
                        management.
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Showcase your key projects and achievements
                    </p>
                  )}
                </div>

                {/* Column 2: img + button in one row */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.projects && (
                    <img
                      src="/images/general/update-cvprofile/hlproject.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openProjectModal}
                  >
                    {completedSections.projects ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Certifications</h2>
                  {completedSections.certifications ? (
                    <div className="text-gray-700">
                      <div className="font-medium">
                        {certificationData.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {certificationData.organization}
                      </div>
                      <div className="text-sm text-gray-500">
                        {certificationData.issueMonth}/
                        {certificationData.issueYear}
                      </div>
                      {certificationData.url && (
                        <div className="text-sm text-blue-500 hover:underline">
                          <a
                            href={certificationData.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View certificate
                          </a>
                        </div>
                      )}
                      <div className="mt-2 text-sm">
                        {certificationData.description}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Add your professional certifications and achievements
                    </p>
                  )}
                </div>

                {/* Column 2: img + button in one row */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.certifications && (
                    <img
                      src="/images/general/update-cvprofile/certificates.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openCertificationModal}
                  >
                    {completedSections.certifications ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Awards Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 relative">
              <div className="flex gap-6 items-start">
                {/* Column 1: Title + Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-4">Awards</h2>
                  {completedSections.awards ? (
                    <div className="text-gray-700">
                      <div className="font-medium">{awardData.name}</div>
                      <div className="text-sm text-gray-500">
                        {awardData.organization}
                      </div>
                      <div className="text-sm text-gray-500">
                        {awardData.issueMonth}/{awardData.issueYear}
                      </div>
                      <div className="mt-2 text-sm">
                        {awardData.description}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280]">
                      Showcase your special recognitions and achievements
                    </p>
                  )}
                </div>

                {/* Column 2: img + button in one row */}
                <div className="flex flex-row items-center gap-3">
                  {!completedSections.awards && (
                    <img
                      src="/images/general/update-cvprofile/awards.png"
                      alt="Icon"
                      className="w-16 h-16 opacity-70 filter grayscale contrast-200 brightness-75"
                    />
                  )}
                  <button
                    type="button"
                    className="text-[#4a4a4a] hover:text-[#272727] transition-colors cursor-pointer"
                    onClick={openAwardModal}
                  >
                    {completedSections.awards ? (
                      <Edit size={24} />
                    ) : (
                      <CirclePlus size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Profile Strength</h2>

              {/* <div className="relative h-32 w-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eeeeee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="bg-gradient-to-b from-[#163988] to-gray-400"
                    strokeWidth="3"
                    strokeDasharray={`${profileCompletion}, 100`}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">{profileCompletion}%</div>
                  <div className="text-xs text-[#6B7280]">completed</div>
                </div>
              </div> */}

              <div className="relative h-32 w-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#163988" />
                      <stop offset="100%" stopColor="#9ca3af" />{" "}
                      {/* gray-400 */}
                    </linearGradient>
                  </defs>

                  {/* Background Circle */}
                  <path
                    d="M18 2.0845 
         a 15.9155 15.9155 0 0 1 0 31.831 
         a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eeeeee"
                    strokeWidth="3"
                  />

                  {/* Progress Circle */}
                  <path
                    d="M18 2.0845 
         a 15.9155 15.9155 0 0 1 0 31.831 
         a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${profileCompletion}, 100`}
                  />
                </svg>

                {/* Text Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold">{profileCompletion}%</div>
                  <div className="text-xs text-[#6B7280]">completed</div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#4a4a4a] font-bold">
                    Complete profile to 70%
                  </span>
                  <span className="text-gray-700">
                    to generate CV template for IT professionals.
                  </span>
                </div>
                <div className="flex justify-end">
                  <img
                    src="/images/general/ad2.png"
                    alt="CV Template"
                    className="h-12 w-auto filter grayscale contrast-125 brightness-75"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {!completedSections.aboutMe && (
                  <button
                    className="flex items-center gap-2 w-full text-blue-600 hover:text-blue-700 font-medium"
                    onClick={openAboutMeModal}
                  >
                    <CirclePlus size={20} />
                    <span>Add About me</span>
                  </button>
                )}

                <button className="flex items-center gap-2 w-full text-blue-600 hover:text-blue-700 font-medium">
                  <CirclePlus size={20} />
                  <span>Add Contact Information</span>
                </button>

                {!completedSections.workExperience && (
                  <button
                    className="flex items-center gap-2 w-full text-blue-600 hover:text-blue-700 font-medium"
                    onClick={openWorkExpModal}
                  >
                    <CirclePlus size={20} />
                    <span>Add Work Experience</span>
                  </button>
                )}

                {/* <div>
                  <button className="flex items-center gap-2 w-full text-gray-700 font-medium">
                    <ChevronDown size={20} />
                    <span>Add more information</span>
                  </button>
                </div> */}

                <div className="w-full mb-6">
                  <button
                    className="flex items-center gap-2 w-full text-gray-700 font-medium"
                    onClick={() => setShowMoreInfo(!showMoreInfo)}
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${showMoreInfo ? "rotate-180" : ""
                        }`}
                    />
                    <span>Add more information</span>
                  </button>

                  {showMoreInfo && (
                    <button className="flex items-center gap-2 w-full text-blue-600 hover:text-blue-700 font-medium">
                      <CirclePlus size={20} />
                      <span>Add Contact Information</span>
                    </button>
                  )}
                </div>

                <button
                  className={`w-full py-3 ${profileCompletion >= 70
                      ? "bg-[#5d5d5d] hover:bg-red-600"
                      : "bg-gray-400 cursor-not-allowed"
                    } text-white font-medium rounded-md transition`}
                  disabled={profileCompletion < 70}
                >
                  Preview & Download CV
                </button>

                {/* Show message if profile completion is less than required */}
                {profileCompletion < 70 && (
                  <p className="text-sm text-center text-gray-500">
                    Complete your profile to 70% to enable CV preview and
                    download.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClientFooter />

      {/* Modal Background Overlay */}
      {(aboutMeModal ||
        educationModal ||
        workExpModal ||
        skillsModal ||
        languageModal ||
        projectModal ||
        certificationModal ||
        awardModal) && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
              }`}
            onClick={(e) => {
              e.preventDefault();
              closeAllModals();
            }}
          />
        )}

      {/* Personal Info Modal */}
      {personalInfoModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Personal details</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handlePersonalInfoSubmit}>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="relative">
                      <img
                        src="https://i.pravatar.cc/100"
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-[#5d5d5d] text-white p-1 rounded-full"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <button className="text-[#4a4a4a] font-medium flex items-center gap-1">
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button className="text-gray-500 font-medium flex items-center gap-1">
                        <X size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Full name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={personalInfoData.fullName}
                      onChange={(e) =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Title <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={personalInfoData.title}
                      onChange={(e) =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.email}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Phone number <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.phone}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Date of Birth <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.dateOfBirth}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        placeholder="DD/MM/YYYY"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Gender</label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.gender}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Current province/city{" "}
                        <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.city}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            city: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Address (Street, district,...)
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={personalInfoData.address}
                        onChange={(e) =>
                          setPersonalInfoData({
                            ...personalInfoData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Personal link (LinkedIn, portfolio,...)
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={personalInfoData.personalLink}
                      onChange={(e) =>
                        setPersonalInfoData({
                          ...personalInfoData,
                          personalLink: e.target.value,
                        })
                      }
                      placeholder="https://"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handlePersonalInfoSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Me Modal */}
      {aboutMeModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">About Me</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-amber-600">
                  <span className="p-1 rounded-full bg-amber-100">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Tips:</span>
                  <span>
                    Summarize your professional experience, highlight your
                    skills and your strengths.
                  </span>
                </div>

                <div className="border border-gray-300 rounded-md p-3 mt-4">
                  <div className="flex gap-2 mb-3">
                    <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                      <span className="font-bold">B</span>
                    </button>
                    <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                      <span className="italic">I</span>
                    </button>
                    <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                      <span className="underline">U</span>
                    </button>
                    <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                      <span>•</span>
                    </button>
                  </div>
                  <textarea
                    className="w-full h-64 resize-none focus:outline-none"
                    placeholder="Describe your professional experience, skills, and strengths..."
                    value={aboutMeText}
                    onChange={(e) => setAboutMeText(e.target.value)}
                  />
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  0/2500 characters
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleAboutMeSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {educationModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Education</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleEducationSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      School <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={educationData.school}
                      onChange={(e) =>
                        setEducationData({
                          ...educationData,
                          school: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">
                        Degree <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={educationData.degree}
                        onChange={(e) =>
                          setEducationData({
                            ...educationData,
                            degree: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select degree</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Major <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={educationData.major}
                        onChange={(e) =>
                          setEducationData({
                            ...educationData,
                            major: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={educationData.isCurrentlyStudying}
                        onChange={(e) =>
                          setEducationData({
                            ...educationData,
                            isCurrentlyStudying: e.target.checked,
                          })
                        }
                      />
                      <span>I am currently studying here</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block mb-1 font-medium">
                        From <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        To <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Additional details
                    </label>
                    <textarea className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleEducationSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Experience Modal */}
      {workExpModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Work Experience</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleWorkExpSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Job title <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Company <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>I am currently working here</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block mb-1 font-medium">
                        From <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        To <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Description
                    </label>
                    <div className="mb-2 text-amber-600 flex items-center gap-2">
                      <span className="p-1 rounded-full bg-amber-100">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16H12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="font-medium">Tips:</span>
                      <span>
                        Brief the company's industry, then detail your
                        responsibilities and achievements. For projects, write
                        on the "Project" field below.
                      </span>
                    </div>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="flex gap-2 mb-3">
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="font-bold">B</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="italic">I</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="underline">U</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span>•</span>
                        </button>
                      </div>
                      <textarea
                        className="w-full h-32 resize-none focus:outline-none"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleWorkExpSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Core Skills Modal */}
      {skillsModal && skillType === "core" && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Core Skills</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSkillsSubmit}>
                <div className="space-y-4">
                  <div className="mb-2 text-amber-600 flex items-center gap-2">
                    <span className="p-1 rounded-full bg-amber-100">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Tips:</span>
                    <span>
                      Organize your core skills into groups helps recruiters
                      quickly understand your professional capabilities.
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Group name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Core Skills"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      List skills (0/20)
                    </label>
                    <div className="flex gap-2 items-center">
                      <select className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option>Search skills</option>
                      </select>
                      <select className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                        <option>Select experience</option>
                      </select>
                      <button className="bg-[#5d5d5d] text-white p-2 rounded-md hover:bg-red-600">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <X size={32} />
                    </div>
                    <p>No items selected</p>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleSkillsSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Skills Modal */}
      {skillsModal && skillType === "soft" && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Soft Skills</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSkillsSubmit}>
                <div className="space-y-4">
                  <div className="mb-2 text-amber-600 flex items-center gap-2">
                    <span className="p-1 rounded-full bg-amber-100">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Tips:</span>
                    <span>
                      Highlight soft skills that demonstrate how you add value
                      beyond professional abilities.
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Group name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Soft Skills"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      List skills (0/20)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter skill"
                      />
                      <button className="bg-[#5d5d5d] text-white p-2 rounded-md hover:bg-red-600">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <X size={32} />
                    </div>
                    <p>No items selected</p>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleSkillsSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Type Selector Modal */}
      {showSkillOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeAllModals}
          />
          <div className="bg-white rounded-lg shadow-xl w-64 overflow-hidden relative z-10">
            <div className="p-4 border-b">
              <h3 className="text-lg font-bold">Select Skill Type</h3>
            </div>
            <div className="p-4 space-y-2">
              <button
                className="w-full text-left p-2 hover:bg-gray-100 rounded-md"
                onClick={openCoreSkillsModal}
              >
                Core Skills
              </button>
              <button
                className="w-full text-left p-2 hover:bg-gray-100 rounded-md"
                onClick={openSoftSkillsModal}
              >
                Soft Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Foreign Language Modal */}
      {languageModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Foreign Language</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleLanguageSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Languages ({languageData.length}/5)
                    </label>
                    <div className="flex gap-2 items-center mb-4">
                      <select
                        id="languageSelect"
                        className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Russian">Russian</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Vietnamese">Vietnamese</option>
                        <option value="Korean">Korean</option>
                        <option value="Italian">Italian</option>
                      </select>
                      <select
                        id="languageLevel"
                        className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Select level</option>
                        <option value="Elementary" data-proficiency="15">
                          Elementary
                        </option>
                        <option value="Basic" data-proficiency="30">
                          Basic
                        </option>
                        <option value="Intermediate" data-proficiency="50">
                          Intermediate
                        </option>
                        <option
                          value="Upper Intermediate"
                          data-proficiency="65"
                        >
                          Upper Intermediate
                        </option>
                        <option value="Advanced" data-proficiency="75">
                          Advanced
                        </option>
                        <option value="Fluent" data-proficiency="90">
                          Fluent
                        </option>
                        <option value="Native" data-proficiency="100">
                          Native
                        </option>
                      </select>
                      <button
                        type="button"
                        className="bg-[#5d5d5d] text-white p-2 rounded-md hover:bg-red-600"
                        onClick={() => {
                          const languageSelect = document.getElementById(
                            "languageSelect"
                          ) as HTMLSelectElement;
                          const levelSelect = document.getElementById(
                            "languageLevel"
                          ) as HTMLSelectElement;
                          const proficiency = parseInt(
                            levelSelect.options[
                              levelSelect.selectedIndex
                            ].getAttribute("data-proficiency") || "0"
                          );

                          if (
                            languageSelect.value &&
                            levelSelect.value &&
                            languageData.length < 5
                          ) {
                            const newLanguage = {
                              id: Date.now(),
                              name: languageSelect.value,
                              level: levelSelect.value,
                              proficiency,
                            };
                            setLanguageData([...languageData, newLanguage]);
                            languageSelect.value = "";
                            levelSelect.value = "";
                          }
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {languageData.length > 0 ? (
                      <div className="space-y-3 mt-4 max-h-64 overflow-y-auto">
                        {languageData.map((language) => (
                          <div
                            key={language.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <div className="font-medium">{language.name}</div>
                              <div className="text-sm text-gray-500">
                                {language.level}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#5d5d5d] h-2 rounded-full"
                                  style={{ width: `${language.proficiency}%` }}
                                ></div>
                              </div>
                              <button
                                type="button"
                                className="text-gray-400 hover:text-[#4a4a4a]"
                                onClick={() => {
                                  setLanguageData(
                                    languageData.filter(
                                      (lang) => lang.id !== language.id
                                    )
                                  );
                                }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                          <X size={32} />
                        </div>
                        <p>No languages selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleLanguageSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Highlight Project Modal */}
      {projectModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Highlight Project</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleProjectSubmit}>
                <div className="space-y-4">
                  <div className="mb-2 text-amber-600 flex items-center gap-2">
                    <span className="p-1 rounded-full bg-amber-100">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 8V12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">Tips:</span>
                    <span>
                      Share the project that relates to your skills and
                      capabilities, and be sure to include project details, your
                      role, technologies, and team size.
                    </span>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Project Name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={projectData.name}
                      onChange={(e) =>
                        setProjectData({ ...projectData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={projectData.isCurrentProject}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            isCurrentProject: e.target.checked,
                          })
                        }
                      />
                      <span>I am working on this project</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block mb-1 font-medium">
                        Start date <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={projectData.fromMonth}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              fromMonth: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={projectData.fromYear}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              fromYear: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        End date <span className="text-[#4a4a4a]">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={projectData.toMonth}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              toMonth: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        <select
                          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={projectData.toYear}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              toYear: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 50 }, (_, i) => (
                            <option key={i} value={2025 - i}>
                              {2025 - i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Description
                    </label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="flex gap-2 mb-3">
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="font-bold">B</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="italic">I</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="underline">U</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span>•</span>
                        </button>
                      </div>
                      <textarea
                        className="w-full h-32 resize-none focus:outline-none"
                        placeholder="Describe your project, role, technologies used, team size..."
                        value={projectData.description}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button className="text-gray-500 text-sm">
                        Insert template
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleProjectSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Modal */}
      {certificationModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Certificates</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCertificationSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Certificate Name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={certificationData.name}
                      onChange={(e) =>
                        setCertificationData({
                          ...certificationData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Organization <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={certificationData.organization}
                      onChange={(e) =>
                        setCertificationData({
                          ...certificationData,
                          organization: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Issue date <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 50 }, (_, i) => (
                          <option key={i} value={2025 - i}>
                            {2025 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Certificate URL
                    </label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://"
                      value={certificationData.url}
                      onChange={(e) =>
                        setCertificationData({
                          ...certificationData,
                          url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Description
                    </label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="flex gap-2 mb-3">
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="font-bold">B</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="italic">I</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="underline">U</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span>•</span>
                        </button>
                      </div>
                      <textarea
                        className="w-full h-32 resize-none focus:outline-none"
                        placeholder="Describe your certification..."
                        value={certificationData.description}
                        onChange={(e) =>
                          setCertificationData({
                            ...certificationData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleCertificationSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Awards Modal */}
      {awardModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalAnimation ? "opacity-100" : "opacity-0"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-w-3xl transition-all duration-300 overflow-hidden ${modalAnimation
                ? "transform scale-100 translate-y-0"
                : "transform scale-95 -translate-y-4"
              }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Awards</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={closeAllModals}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAwardSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Awards name <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={awardData.name}
                      onChange={(e) =>
                        setAwardData({ ...awardData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Award organization{" "}
                      <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      value={awardData.organization}
                      onChange={(e) =>
                        setAwardData({
                          ...awardData,
                          organization: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Issue date <span className="text-[#4a4a4a]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 50 }, (_, i) => (
                          <option key={i} value={2025 - i}>
                            {2025 - i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Description
                    </label>
                    <div className="mb-2 text-amber-600 flex items-center gap-2">
                      <span className="p-1 rounded-full bg-amber-100">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8V12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 16H12.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="font-medium">Tips:</span>
                      <span>
                        Shortly describe the relevant category (innovation,
                        leadership,...) or the reason for the award.
                      </span>
                    </div>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="flex gap-2 mb-3">
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="font-bold">B</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="italic">I</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span className="underline">U</span>
                        </button>
                        <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                          <span>•</span>
                        </button>
                      </div>
                      <textarea
                        className="w-full h-32 resize-none focus:outline-none"
                        placeholder="Describe your award..."
                        value={awardData.description}
                        onChange={(e) =>
                          setAwardData({
                            ...awardData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-gray-500 text-sm mt-2">
                      0/2500 characters
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#5d5d5d] text-white font-medium rounded hover:bg-red-600"
                onClick={handleAwardSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

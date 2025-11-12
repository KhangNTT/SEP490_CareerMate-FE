"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Calendar,
  Rocket,
  Save,
  X,
  Eye,
  Trash2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Package,
  Tag,
  Plus,
} from "lucide-react";
import { createJobPost, CreateJobPostRequest, getSkills, Skill, getRecruiterJobPostings, RecruiterJobPosting } from "@/lib/recruiter-api";
import toast from "react-hot-toast";

export default function CreateJobPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewJob, setViewJob] = useState<RecruiterJobPosting | null>(null);
  const [jobs, setJobs] = useState<RecruiterJobPosting[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  // Skills state
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  
  // State for adding new skill
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [newSkillMustHave, setNewSkillMustHave] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    expirationDate: "",
    yearsOfExperience: "",
    workModel: "",
    salaryRange: "",
    reason: "",
    jobPackage: "",
    // Skills management
    jdSkill: "",
    mustToHave: true,
    skills: [] as Array<{ id: number; mustToHave: boolean; name?: string }>,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await getSkills();
        console.log('📋 Skills response:', response);
        
        if (response.code === 200 && response.result) {
          setAvailableSkills(response.result);
          toast.success(`Loaded ${response.result.length} skills`);
        } else {
          toast.error(response.message || "Failed to load skills");
        }
      } catch (error: any) {
        console.error("Failed to fetch skills:", error);
        toast.error(error.message || "Failed to load skills");
      } finally {
        setIsLoadingSkills(false);
      }
    };
    
    fetchSkills();
  }, []);

  // Fetch recruiter's job postings on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoadingJobs(true);
        const response = await getRecruiterJobPostings();
        console.log('📋 Job postings response:', response);
        
        if (response.code === 0 && response.result) {
          setJobs(response.result);
          toast.success(`Loaded ${response.result.length} job postings`);
        } else if (response.code === 200 && response.result) {
          setJobs(response.result);
        } else {
          toast.error(response.message || "Failed to load job postings");
        }
      } catch (error: any) {
        console.error("Failed to fetch job postings:", error);
        toast.error(error.message || "Failed to load job postings");
      } finally {
        setIsLoadingJobs(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Load template from sessionStorage if available
  useEffect(() => {
    const templateData = sessionStorage.getItem('jobTemplate');
    if (templateData) {
      try {
        const template = JSON.parse(templateData);
        console.log('📋 Loading template:', template);
        
        // Auto-fill form with template data
        setFormData(prev => ({
          ...prev,
          title: template.title || '',
          description: template.description || '',
          address: template.address || '',
          yearsOfExperience: template.yearsOfExperience?.toString() || '',
          workModel: template.workModel || '',
          salaryRange: template.salaryRange || '',
          reason: template.reason || '',
          jobPackage: template.jobPackage || '',
          expirationDate: template.expirationDate || '',
          skills: template.skills || [],
        }));
        
        // Open the form modal
        setIsOpen(true);
        
        // Clear sessionStorage
        sessionStorage.removeItem('jobTemplate');
        
        // Show success toast
        toast.success('Template loaded successfully! ✨', {
          icon: '📋',
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to parse template:', error);
        toast.error('Failed to load template');
      }
    }
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add skill to list
  const handleAddSkill = () => {
    if (!selectedSkillId || selectedSkillId === "") {
      toast.error("Please select a skill");
      return;
    }

    const skillIdNum = parseInt(selectedSkillId);
    if (isNaN(skillIdNum)) {
      toast.error("Invalid skill selection");
      return;
    }
    
    // Check if skill already exists
    if (formData.skills.some(s => s.id === skillIdNum)) {
      toast.error("Skill already added");
      return;
    }
    
    // Find skill name
    const skillName = availableSkills.find(s => s.id === skillIdNum)?.name || `Skill #${skillIdNum}`;
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: skillIdNum, mustToHave: newSkillMustHave, name: skillName }],
    }));
    
    // Reset selection
    setSelectedSkillId("");
  };

  // Remove skill from list
  const handleRemoveSkill = (skillId: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== skillId),
    }));
  };

  // Validate
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required.";
    if (!formData.description.trim()) newErrors.description = "Job description is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.expirationDate) newErrors.expirationDate = "Please choose an expiration date.";
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of experience is required.";
    if (!formData.workModel.trim()) newErrors.workModel = "Work model is required.";
    if (!formData.salaryRange.trim()) newErrors.salaryRange = "Salary range is required.";
    if (!formData.jobPackage.trim()) newErrors.jobPackage = "Job package is required.";
    if (formData.skills.length === 0) newErrors.skills = "Please add at least one skill.";
    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const jobPostData: CreateJobPostRequest = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        expirationDate: formData.expirationDate,
        jdSkills: formData.skills,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        workModel: formData.workModel,
        salaryRange: formData.salaryRange,
        reason: formData.reason || "",
        jobPackage: formData.jobPackage,
      };

      const response = await createJobPost(jobPostData);
      
      if (response.code === 200 || response.code === 201 || response.code === 0) {
        toast.success("Job post created successfully!");
        
        // Refresh job list from server instead of adding locally
        const jobsResponse = await getRecruiterJobPostings();
        if (jobsResponse.code === 0 || jobsResponse.code === 200) {
          setJobs(jobsResponse.result);
        }
        
        setIsOpen(false);

        // Reset form
        setFormData({
          title: "",
          description: "",
          address: "",
          expirationDate: "",
          yearsOfExperience: "",
          workModel: "",
          salaryRange: "",
          reason: "",
          jobPackage: "",
          jdSkill: "",
          mustToHave: true,
          skills: [],
        });
        setSelectedSkillId("");
        setErrors({});
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create job post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel form
  const handleCancel = () => {
    setIsOpen(false);
    setErrors({});
  };

  // View job details
  const handleView = (job: any) => {
    setViewJob(job);
  };

  const closeView = () => {
    setViewJob(null);
  };

  // Delete job
  const handleDelete = (job: any) => {
    setConfirmDelete(job);
  };

  const confirmDeleteJob = () => {
    setJobs((prev) => prev.filter((j) => j.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="p-4 sm:p-0 relative">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Job Posts</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition"
        >
          <PlusCircle className="w-5 h-5 mr-1" /> Create Job Post
        </button>
      </header>

      {/* Danh sách Job */}
      {isLoadingJobs ? (
        <div className="rounded-lg border bg-white p-6 shadow-sm text-center">
          <p className="text-gray-600">Loading job postings...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Work Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Expiration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    #{job.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.workModel}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      job.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      job.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      job.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(job.expirationDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.jobPackage === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                      job.jobPackage === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.jobPackage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleView(job)}
                      className="text-sky-600 hover:text-sky-800 transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 shadow-sm text-gray-600">
          <p>No job posts yet. Click “Create Job Post” to add one.</p>
        </div>
      )}

      {/* Popup Create Job */}
      {isOpen && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[600px] z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-sky-600" /> Create Job
              Post
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Frontend Developer"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full p-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe the job responsibilities and requirements..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-500" /> Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Ho Chi Minh City, Vietnam"
              />
              {errors.address && (
                <p className="text-sm text-red-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" /> Years of Experience
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  min="0"
                  className={`w-full p-2 border rounded-md ${
                    errors.yearsOfExperience ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g. 2"
                />
                {errors.yearsOfExperience && (
                  <p className="text-sm text-red-600 mt-1">{errors.yearsOfExperience}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Briefcase className="w-4 h-4 mr-1 text-gray-500" /> Work Model
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="workModel"
                  value={formData.workModel}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.workModel ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select...</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
                {errors.workModel && (
                  <p className="text-sm text-red-600 mt-1">{errors.workModel}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500" /> Salary Range
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.salaryRange ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. $1000 - $2000"
              />
              {errors.salaryRange && (
                <p className="text-sm text-red-600 mt-1">{errors.salaryRange}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" /> Expiration Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.expirationDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expirationDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.expirationDate}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Package className="w-4 h-4 mr-1 text-gray-500" /> Job Package
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="jobPackage"
                  value={formData.jobPackage}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.jobPackage ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Package...</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
                {errors.jobPackage && (
                  <p className="text-sm text-red-600 mt-1">{errors.jobPackage}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Tag className="w-4 h-4 mr-1 text-gray-500" /> Skills
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-2 mb-2">
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  disabled={isLoadingSkills}
                >
                  <option value="">
                    {isLoadingSkills ? "Loading skills..." : "Select a skill"}
                  </option>
                  {availableSkills.map((jdskill) => (
                    <option key={jdskill.id} value={jdskill.id}>
                      {jdskill.name}
                    </option>
                  ))}
                </select>
                <label className="flex items-center space-x-2 px-3 border border-gray-300 rounded-md">
                  <input
                    type="checkbox"
                    checked={newSkillMustHave}
                    onChange={(e) => setNewSkillMustHave(e.target.checked)}
                    className="h-4 w-4 text-sky-600"
                  />
                  <span className="text-sm text-gray-700">Must Have</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  disabled={isLoadingSkills}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.skills && (
                <p className="text-sm text-red-600 mb-2">{errors.skills}</p>
              )}
              <div className="space-y-2">
                {formData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700">
                      {skill.name || `Skill #${skill.id}`} {skill.mustToHave && <span className="text-red-600 font-medium">(Must Have)</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Why are you posting this job?"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
              >
                <Save className="w-4 h-4 mr-1" /> Save Job Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Popup View Job */}
      {viewJob && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white border border-gray-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[500px] z-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-sky-600" /> View Job Post
            </h2>
            <button onClick={closeView} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="text-base font-medium text-gray-800">{viewJob.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-base text-gray-700 whitespace-pre-line">{viewJob.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-base text-gray-800">{viewJob.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Work Model</p>
                <p className="text-base text-gray-800">{viewJob.workModel}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Years of Experience</p>
                <p className="text-base text-gray-800">{viewJob.yearsOfExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="text-base text-gray-800">{viewJob.salaryRange}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Expiration Date</p>
                <p className="text-base text-gray-800">{viewJob.expirationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Package</p>
                <p className="text-base text-gray-800">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewJob.jobPackage === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                    viewJob.jobPackage === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {viewJob.jobPackage}
                  </span>
                </p>
              </div>
            </div>
            {viewJob.skills && viewJob.skills.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewJob.skills.map((skill: any) => (
                    <span
                      key={skill.id}
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        skill.mustToHave
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {skill.name || `Skill #${skill.id}`} {skill.mustToHave && '★'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {viewJob.reason && (
              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="text-base text-gray-700">{viewJob.reason}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={closeView}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Popup Confirm Delete */}
      {confirmDelete && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white border border-red-200 shadow-xl rounded-lg p-6 w-[90%] sm:w-[400px] z-50"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-600" /> Confirm Delete
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteJob}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

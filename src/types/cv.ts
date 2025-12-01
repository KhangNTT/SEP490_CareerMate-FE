export interface CVTemplate { 
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'classic' | 'vintage' | 'polished' | 'modern' | 'minimalist' | 'professional';
  features: string[];
  defaultData?: CVData;
  previewImage?: string;
}

export interface CVData {
  // optional top-level preview image (used by some templates)
  previewImage?: string;
  personalInfo: {
    fullName: string;
    position: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string;
    photoUrl?: string;
    dob?: string;
    gender?: string;
    nationality?: string;
  };
  experience: Array<{
    position: string;
    company: string;
    period: string;
    description: string;
    achievements?: string[];
    location?: string;
    responsibilities?: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    gpa?: string;
    description?: string;
    honors?: string[];
  }>;
  skills: Array<{
    category: string;
    items: Array<{
      id: string;
      skill: string;
      experience?: string;
    }>;
  }>;
  languages: Array<{
    language: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  // New fields for enhanced templates
  softSkills?: string[];
  awards?: Array<{
    name: string;
    organization?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    role?: string;
    period?: string;
  }>;
  hobbies?: string[];
  references?: Array<{ name: string; relation?: string; contact?: string }>;
}

// Define the complete sample CV data for a student
export const SAMPLE_CV_DATA: CVData = {
  personalInfo: {
    fullName: "Nguyễn Văn An",
    position: "IT Student",
    email: "an.nguyen@email.com",
    phone: "+84 123 456 789",
    location: "Hà Nội, Việt Nam",
    website: "https://annguyen.dev",
    linkedin: "https://linkedin.com/in/annguyen/",
    summary:
      "Final-year IT student with a strong focus on web development and software engineering. Passionate about applying theoretical knowledge into practical applications. Seeking opportunities to develop professional skills and contribute to innovative projects in the tech industry.",
    photoUrl: "https://randomuser.me/api/portraits/men/26.jpg",
    dob: "15/05/2002",
    nationality: "Vietnamese"
  },
  experience: [
    {
      position: "Web Development Intern",
      company: "TechViet Solutions",
      period: "06/2023 – 09/2023",
      description:
        "Assisted in developing and maintaining web applications for clients in the e-commerce sector.",
      achievements: [
        "Contributed to 3 client projects using React and Next.js frameworks",
        "Optimized website loading speed by 30% through code refactoring",
        "Collaborated with a team of 5 developers using Git and Agile methodologies"
      ]
    },
    {
      position: "Student Research Assistant",
      company: "University Research Lab",
      period: "01/2023 – 05/2023",
      description:
        "Participated in research projects related to machine learning applications in image processing.",
      achievements: [
        "Collected and preprocessed datasets for training machine learning models",
        "Assisted in developing a Python-based tool for automated image analysis",
        "Co-authored a research paper presented at a student conference"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      school: "Hanoi University of Science and Technology",
      period: "2020 – 2024 (Expected)",
      gpa: "3.7/4.0",
      description: "Major in Software Engineering with focus on Web Technologies",
      honors: ["Dean's List 2021-2022", "Academic Excellence Scholarship"]
    }
  ],
  skills: [
    {
      category: "Programming Languages",
      items: [
        { id: "1", skill: "JavaScript", experience: "3 years" },
        { id: "2", skill: "TypeScript", experience: "2 years" },
        { id: "3", skill: "Python", experience: "2 years" },
        { id: "4", skill: "Java", experience: "1 year" },
        { id: "5", skill: "C++", experience: "1 year" }
      ]
    },
    {
      category: "Web Technologies",
      items: [
        { id: "6", skill: "React", experience: "2 years" },
        { id: "7", skill: "Next.js", experience: "1 year" },
        { id: "8", skill: "HTML/CSS", experience: "3 years" },
        { id: "9", skill: "Node.js", experience: "2 years" },
        { id: "10", skill: "TailwindCSS", experience: "1 year" }
      ]
    },
    {
      category: "Tools & Platforms",
      items: [
        { id: "11", skill: "Git", experience: "3 years" },
        { id: "12", skill: "Docker", experience: "1 year" },
        { id: "13", skill: "Firebase", experience: "1 year" },
        { id: "14", skill: "AWS Basics" },
        { id: "15", skill: "MongoDB", experience: "1 year" }
      ]
    }
  ],
  languages: [
    {
      language: "Vietnamese",
      level: "Native"
    },
    {
      language: "English",
      level: "Advanced"
    },
    {
      language: "Japanese",
      level: "Beginner"
    }
  ],
  certifications: [
    {
      name: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
      url: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
    }
  ],
  projects: [
    {
      name: "E-Learning Platform",
      description:
        "A web application that allows students to access course materials, submit assignments, and interact with instructors.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
      url: "https://student-elearning.vercel.app",
      github: "https://github.com/annguyen/elearning-platform",
      period: "01/2023 - 04/2023"
    },
    {
      name: "Smart Campus Mobile App",
      description:
        "Mobile application that helps students navigate campus, check classroom availability, and receive notifications about university events.",
      technologies: ["React Native", "Firebase", "Google Maps API"],
      github: "https://github.com/annguyen/smart-campus",
      period: "09/2022 - 12/2022"
    }
  ],
  previewImage: "https://randomuser.me/api/portraits/men/26.jpg",
  hobbies: ['Programming', 'Reading', 'Photography', 'Basketball'],
  references: [
    { name: 'Dr. Trần Minh', relation: 'Academic Advisor', contact: 'minh.tran@hust.edu.vn' },
    { name: 'Lê Hoàng', relation: 'Internship Supervisor', contact: 'hoang.le@techviet.com' }
  ],
  softSkills: ["Communication", "Problem Solving", "Time Management", "Teamwork", "Adaptability"]
};

// Student data is defined above as SAMPLE_CV_DATA

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'classic',
    name: 'Classic CV',
    description: 'Traditional template suitable for all industries',
    icon: '📋',
    category: 'classic',
    features: ['Traditional design', 'Easy to read', 'Fits all industries', 'Print-friendly'],
    defaultData: SAMPLE_CV_DATA,
    previewImage: '/images/cvtemp/classic.png',
  },
  {
    id: 'vintage',
    name: 'Vintage CV',
    description: 'Vintage template for design and marketing fields',
    icon: '🎨',
    category: 'vintage',
    features: ['Vintage design', 'Vibrant colors', 'Perfect for creatives', 'Unique style'],
    defaultData: {
      ...SAMPLE_CV_DATA,
      personalInfo: { ...SAMPLE_CV_DATA.personalInfo, position: 'UX/UI Designer' },
    },
    previewImage: '/images/cvtemp/vintage.png',
  },
  {
    id: 'polished',
    name: 'Polished CV',
    description: 'Polished template with a clean and professional design',
    icon: '🏢',
    category: 'polished',
    features: ['Polished design', 'Two-column layout', 'Professional colors', 'ATS-friendly'],
    defaultData: {
      ...SAMPLE_CV_DATA,
      personalInfo: { ...SAMPLE_CV_DATA.personalInfo, position: 'IT Project Manager' },
    },
    previewImage: '/images/cvtemp/polished.png',
  },
  {
    id: 'modern',
    name: 'Modern CV',
    description: 'Modern template with a clean and professional design',
    icon: '✨',
    category: 'modern',
    features: ['Modern design', 'Content-focused', 'Elegant', 'Easy to scan'],
    defaultData: {
      ...SAMPLE_CV_DATA,
      personalInfo: { ...SAMPLE_CV_DATA.personalInfo, position: 'Mobile App Developer' },
    },
    previewImage: '/images/cvtemp/modern.png',
  },
  {
    id: 'minimalist',
    name: 'Minimalist CV',
    description: 'Minimalist template with a clean and simple design',
    icon: '🎨',
    category: 'minimalist',
    features: ['Minimalist design', 'Focus on content', 'Easy to read', 'ATS-friendly'],
    defaultData: SAMPLE_CV_DATA,
    previewImage: '/images/cvtemp/minimal.png',
  },
  {
    id: 'professional',
    name: 'Professional CV',
    description: 'Professional template with a clean and structured design',
    icon: '💼',
    category: 'professional',
    features: ['Professional design', 'Structured layout', 'Clear sections', 'Print-friendly'],
    defaultData: {
      ...SAMPLE_CV_DATA,
      personalInfo: { ...SAMPLE_CV_DATA.personalInfo, position: 'Software Development Engineer' },
    },
    previewImage: '/images/cvtemp/professional.png',
  },
];

// export const SAMPLE_CV_DATA: CVData = {
//   personalInfo: {
//     fullName: "Nguyen Van A",
//
//     position: "Frontend Developer",
//     email: "nguyenvana@email.com",
//     phone: "0123456789",
//     location: "Hanoi, Vietnam",
//     website: "https://nguyenvana.dev",
//     linkedin: "https://linkedin.com/in/nguyenvana",
//     summary: "Frontend Developer with 3 years of experience in building web applications using React, JavaScript, and modern technologies. Passionate about creating beautiful user interfaces and delivering the best user experiences."
//   },
//   experience: [
//     {
//       position: "Frontend Developer",
//       company: "TechCorp Vietnam",
//       period: "2022 - Present",
//       description: "Develop and maintain web applications using React, TypeScript, and TailwindCSS.",
//       achievements: [
//         "Improved page load speed by 40% through code optimization",
//         "Developed 15+ new features for the main product",
//         "Mentored 3 junior developers"
//       ]
//     },
//     {
//       position: "Junior Frontend Developer",
//       company: "StartupXYZ",
//       period: "2021 - 2022",
//       description: "Assisted in developing web and mobile applications using React and React Native.",
//       achievements: [
//         "Built 5+ reusable components",
//         "Contributed to the development of the company's MVP"
//       ]
//     }
//   ],
//   education: [
//     {
//       degree: "Bachelor of Information Technology",
//       school: "Hanoi University of Science and Technology",
//       period: "2017 - 2021",
//       gpa: "3.5/4.0",
//       description: "Major in Computer Science"
//     }
//   ],
//   skills: [
//     {
//       category: "Programming Languages",
//       items: ["JavaScript", "TypeScript", "Python", "Java"]
//     },
//     {
//       category: "Frontend Technologies",
//       items: ["React", "Next.js", "Vue.js", "HTML/CSS", "TailwindCSS"]
//     },
//     {
//       category: "Tools & Others",
//       items: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL"]
//     }
//   ],
//   languages: [
//     {
//       language: "Vietnamese",
//       level: "Native"
//     },
//     {
//       language: "English",
//       level: "Advanced"
//     }
//   ],
//   certifications: [
//     {
//       name: "AWS Certified Developer",
//       issuer: "Amazon Web Services",
//       date: "2023",
//       url: "https://aws.amazon.com/certification/"
//     }
//   ],
//   projects: [
//     {
//       name: "E-commerce Platform",
//       description: "An e-commerce platform built with React and Node.js",
//       technologies: ["React", "Node.js", "MongoDB", "Stripe"],
//       url: "https://demo-ecommerce.com",
//       github: "https://github.com/nguyenvana/ecommerce"
//     }
//   ]
// };

//CV Example







// Alternative sample CV data example for a professional
/* 
export const CV_DATA_PROFESSIONAL: CVData = {
  personalInfo: {
    fullName: "Nguyễn Thành Công",
    position: "Senior Software Engineer",
    email: "cong.nguyen@techcompany.com",
    phone: "+84 901 234 567",
    location: "Ho Chi Minh City, Vietnam",
    website: "https://nguyencong.dev",
    linkedin: "https://linkedin.com/in/congnt/",
    summary:
      "Senior Software Engineer with 8 years of experience building scalable applications and leading development teams. Expertise in cloud architecture, microservices, and agile methodologies."
  },
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Vietnam",
      period: "2020 – Present",
      description:
        "Lead a team of 6 engineers developing enterprise-grade applications for international clients.",
      achievements: [
        "Architected a microservices system that improved scalability by 200%",
        "Reduced deployment time by 70% through CI/CD pipeline optimization",
        "Mentored 8 junior developers who were promoted within 18 months"
      ]
    },
    {
      position: "Software Engineer",
      company: "Global Innovation Corp",
      period: "2017 – 2020",
      description:
        "Developed full-stack applications for financial services clients using Java and React.",
      achievements: [
        "Implemented secure payment processing system handling $2M daily transactions",
        "Improved application response time by 40% through code optimization",
        "Received Employee of the Year award in 2019"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Computer Science",
      school: "Vietnam National University",
      period: "2015 – 2017",
      gpa: "3.8/4.0",
      description: "Focused on Distributed Systems and Cloud Computing"
    }
  ],
  skills: [],
  languages: [],
  certifications: [],
  projects: []
};
*/
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    readTime: number;
    publishedAt: string;
    featured?: boolean;
    image: string;
}

export interface VideoContent {
    id: string;
    title: string;
    thumbnail: string;
    duration?: string;
    views?: number;
    youtubeId: string;
    channel: string;
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
}

export const blogCategories: BlogCategory[] = [
    { id: '1', name: 'IT Jobs', slug: 'it-jobs' },
    { id: '2', name: 'IT Career', slug: 'it-career' },
    { id: '3', name: 'Job Application & Promotion', slug: 'job-application-promotion' },
    { id: '4', name: 'IT Expertise', slug: 'it-expertise' },
    { id: '5', name: 'IT Stories', slug: 'it-stories' },
];

export const mockBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'DevSecOps workflow emerged to solve the balance between software development speed and increasingly high security requirements. This article will guide you through 7 "backbone" steps of a process...',
        excerpt: 'DevSecOps workflow emerged to solve the balance between software development speed and increasingly high security requirements.',
        content: 'Full content here...',
        category: 'IT Expertise',
        tags: ['DevSecOps', 'Security', 'Development'],
        readTime: 26,
        publishedAt: '2024-01-15',
        featured: true,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '2',
        title: 'DevSecOps plays an important role in the context of increasingly complex cybersecurity and shortened software development cycles. If you love and want to have a successful career in this field...',
        excerpt: 'DevSecOps plays an important role in the context of increasingly complex cybersecurity and shortened software development cycles.',
        content: 'Full content here...',
        category: 'IT Career',
        tags: ['DevSecOps', 'Career', 'Security'],
        readTime: 34,
        publishedAt: '2024-01-12',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '3',
        title: 'How to build an impressive IT portfolio to attract recruiters',
        excerpt: 'Portfolio is one of the most important factors that help you stand out in the eyes of IT recruiters.',
        content: 'Full content here...',
        category: 'Job Application & Promotion',
        tags: ['Portfolio', 'Career', 'Job Search'],
        readTime: 15,
        publishedAt: '2024-01-10',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '4',
        title: 'Top 10 most sought-after programming skills in 2024',
        excerpt: 'The IT market is always changing and programming skills are no exception. These are the hottest skills right now.',
        content: 'Full content here...',
        category: 'IT Expertise',
        tags: ['Programming', 'Skills', 'Technology'],
        readTime: 20,
        publishedAt: '2024-01-08',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '5',
        title: 'Success story: From IT student to Tech Lead at startup',
        excerpt: 'Sharing the journey from an ordinary IT student to Tech Lead position at a successful startup.',
        content: 'Full content here...',
        category: 'IT Stories',
        tags: ['Success Story', 'Career Path', 'Startup'],
        readTime: 18,
        publishedAt: '2024-01-05',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '6',
        title: 'How to prepare a professional IT CV to impress recruiters',
        excerpt: 'CV is the first important step in the application process. Learn how to create a professional IT CV.',
        content: 'Full content here...',
        category: 'Job Application & Promotion',
        tags: ['CV', 'Resume', 'Job Application'],
        readTime: 12,
        publishedAt: '2024-01-03',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '7',
        title: 'Important soft skills for developers: Communication and teamwork',
        excerpt: 'Soft skills are no less important than technical skills in an IT career.',
        content: 'Full content here...',
        category: 'IT Career',
        tags: ['Soft Skills', 'Communication', 'Teamwork'],
        readTime: 14,
        publishedAt: '2024-01-01',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '8',
        title: 'Technology trends 2024: AI, Blockchain and Cloud Computing',
        excerpt: 'Explore the hottest technology trends of 2024 that every IT professional should know.',
        content: 'Full content here...',
        category: 'IT Expertise',
        tags: ['Technology Trends', 'AI', 'Blockchain'],
        readTime: 22,
        publishedAt: '2023-12-28',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '9',
        title: 'Remote work: Tips to succeed in a remote work environment',
        excerpt: 'Remote work is becoming a trend. Learn how to work effectively from home.',
        content: 'Full content here...',
        category: 'IT Career',
        tags: ['Remote Work', 'Productivity', 'Work Life'],
        readTime: 16,
        publishedAt: '2023-12-25',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '10',
        title: 'Code Review: Best practices for effective code review',
        excerpt: 'Code review is an important part of the software development process. Learn how to review code well.',
        content: 'Full content here...',
        category: 'IT Expertise',
        tags: ['Code Review', 'Best Practices', 'Development'],
        readTime: 18,
        publishedAt: '2023-12-22',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '11',
        title: 'Career transition to IT: Journey from zero to hero',
        excerpt: 'Stories of people who successfully transitioned to IT careers from other fields.',
        content: 'Full content here...',
        category: 'IT Stories',
        tags: ['Career Change', 'Success Story', 'Motivation'],
        readTime: 20,
        publishedAt: '2023-12-20',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    },
    {
        id: '12',
        title: 'Testing in software development: Unit test, Integration test and E2E test',
        excerpt: 'Testing is an indispensable part of software development. Learn about different types of tests.',
        content: 'Full content here...',
        category: 'IT Expertise',
        tags: ['Testing', 'Quality Assurance', 'Development'],
        readTime: 24,
        publishedAt: '2023-12-18',
        featured: false,
        image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png'
    }
];

export const mockVideos: VideoContent[] = [
    {
        id: '1',
        title: 'PHP in 100 Seconds',
        thumbnail: 'https://img.youtube.com/vi/a7_WFUlFS94/maxresdefault.jpg',
        duration: '2:24',
        views: 2100000,
        youtubeId: 'a7_WFUlFS94',
        channel: 'Fireship'
    },
    {
        id: '2',
        title: 'Python in 100 Seconds',
        thumbnail: 'https://img.youtube.com/vi/x7X9w_GIm1s/maxresdefault.jpg',
        duration: '2:31',
        views: 4500000,
        youtubeId: 'x7X9w_GIm1s',
        channel: 'Fireship'
    },
    {
        id: '3',
        title: 'Kotlin in 100 Seconds',
        thumbnail: 'https://img.youtube.com/vi/xT8oP0wy-A0/maxresdefault.jpg',
        duration: '2:18',
        views: 1800000,
        youtubeId: 'xT8oP0wy-A0',
        channel: 'Fireship'
    },
    {
        id: '4',
        title: 'React in 100 Seconds',
        thumbnail: 'https://img.youtube.com/vi/Tn6-PIqc4UM/maxresdefault.jpg',
        duration: '2:20',
        views: 3200000,
        youtubeId: 'Tn6-PIqc4UM',
        channel: 'Fireship'
    }
];

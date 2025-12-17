"use client";

import { useEffect, useState, useRef } from "react";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Building2,
  Briefcase,
  Search,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useClientAuth } from "@/hooks/useClientAuth";
import { decodeJWT } from "@/lib/auth-admin";

// Animated Counter Component
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | undefined;
    const startCount = 0;
    const endCount = end;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(
        startCount + (endCount - startCount) * easeOutQuart
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-gray-600">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function RecruiterHomePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [userInfo, setUserInfo] = useState<{
    username: string;
    email: string;
  } | null>(null);

  // Lấy trạng thái auth
  const { mounted, isAuthenticated, accessToken, role } = useClientAuth();
  const { logout, user } = useAuthStore();

  // Decode token CHỈ sau khi có accessToken ở client
  useEffect(() => {
    if (!accessToken) {
      setUserInfo(null);
      return;
    }
    try {
      const decoded = decodeJWT(accessToken);
      setUserInfo({
        email: decoded?.sub || decoded?.email || "User",
        username: decoded?.name || decoded?.sub || "User",
      });

      // Update store user if not set
      if (!user && decoded) {
        useAuthStore.setState({
          user: {
            id: decoded?.sub,
            email: decoded?.email || decoded?.sub,
            username: decoded?.name || decoded?.email || decoded?.sub,
          },
        });
      }
    } catch {
      setUserInfo(null);
    }
  }, [accessToken, user]);

  const handleConsultation = () => {
    // Handle consultation request
    console.log("Consultation requested for:", email);
  };

  const handleStartPosting = () => {
    // Handle start posting
    console.log("Start posting job");
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-[#1b1b20f5] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <img
                    src="/images/general/newlogo.png"
                    alt="Logo"
                    className="h-14 w-auto"
                  />
                  <span className="text-xl font-bold text-[#ffffff]">
                    Recruiter
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/recruiter/recruiter-feature/dashboard"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Dashboard
              </Link>
              <Link
                href="/recruiter/recruiter-feature/profile?tab=account"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Account
              </Link>
              <Link
                href="/recruiter/recruiter-feature/candidates/applications"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Candidates
              </Link>
              <Link
                href="/recruiter/recruiter-feature/services"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Services
              </Link>
              <Link
                href="/recruiter/recruiter-feature/jobs"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Upload Jobs
              </Link>
              <Link
                href="/recruiter/recruiter-feature/support"
                className="text-[#ffffff] hover:text-[#c8c8c8]"
              >
                Support
              </Link>
            </nav>

            {/* Bên phải header */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <>
                  <span className="sm:block text-gray-300 hover:text-white transition-colors hidden text-xs md:inline">
                    For Recruiter abc
                  </span>

                  <ProfileDropdown
                    userName={user?.username || "User"} // Changed to use user.username
                    userEmail={user?.email || userInfo?.email}
                    role={role || undefined}
                    userAvatar="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTPMg7sLIhRN7k0UrPxSsHzujqgLqdTq67Pj4vVqKmr4sFR0eH4h4h-sWjxVvi3vKOl47pyShZMal8qcNuipNE4fbSfblUL99EfUtDrBto"
                  />
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 text-white hover:text-gray-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ffff] to-[#758499] py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Post job openings,
                  <br />
                  find candidates{" "}
                  <span className="cta-highlighted text-[#6da9e9]">
                    effectively.
                  </span>
                </h1>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    Post job postings for free, easily and quickly
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    Reliable candidate sources from various industries and experience levels
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#0ead43] flex-shrink-0" />
                  <span className="text-gray-700 text-lg">
                    CareerMate AI recommends potential candidates, filters highlighted information and automatically ranks by compatibility
                  </span>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[500px] mx-auto">
              <div className="relative z-10">
                {/* Laptop mockup */}
                <div className="bg-gray-900 rounded-t-xl p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300">
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-emerald-50 p-3 rounded">
                        <div className="flex items-center space-x-2 mb-4">
                          <Briefcase className="h-4 w-4 text-[#466895]" />
                          <span className="text-sm font-medium">
                            New Jobs
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          Senior Developer - $25K
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          Marketing Manager - $20K
                        </div>
                        <div className="bg-gray-100 p-2 rounded text-xs">
                          UI/UX Designer - $18K
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#6697d8] rounded-full opacity-50"></div>
              <div className="absolute top-16 -right-8 w-12 h-12 bg-[#063067] rounded-full opacity-40"></div>
              <div className="absolute -bottom-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="mb-2">
                <AnimatedCounter end={1000} suffix="+" duration={2500} />
              </div>
              <div className="text-gray-600 text-lg font-sans">Users</div>
            </div>
            <div className="group">
              <div className="mb-2">
                <AnimatedCounter end={900} suffix="+" duration={2000} />
              </div>
              <div className="text-gray-600 text-lg font-sans">Employers</div>
            </div>
            <div className="group">
              <div className="mb-2">
                <AnimatedCounter end={8100} suffix="+" duration={3000} />
              </div>
              <div className="text-gray-600 text-lg font-sans">
                Applications/year
              </div>
            </div>
            <div className="group">
              <div className="mb-2">
                <AnimatedCounter end={95} suffix="%" duration={1500} />
              </div>
              <div className="text-gray-600 text-lg font-sans">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#e8f1fe] to-[#ccdff9]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Start hiring the best talent today!
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses that trust CareerMate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConsultation}
                className="bg-white text-[#5099f8] border border-[#4691f3] px-8 py-4 rounded-lg font-medium hover:bg-[#b9d2f3] transition-colors"
              >
                Free Consultation
              </button>
              <Link
                href="/user-confirmpage"
                className="bg-[#5196f1] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#87bafd] transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Start Posting Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Platform Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Link
              href="/recruiter/recruiter-feature/services/search"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              {/* 3D illustration placeholder */}
              <div className="relative hover:-rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                <div className="bg-gradient-to-br from-[#bcd1ec] to-[#6b85a7] rounded-2xl flex items-center justify-center cursor-pointer">
                  <div className="text-center">
                    <img
                      src="/img/home3.png"
                      alt="3D Illustration"
                      className="w-full h-80 object-contain p-8"
                    />
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-8 -right-4 w-8 h-8 bg-[#6697d8] rounded-full"></div>
                <div className="absolute bottom-12 -left-6 w-6 h-6 bg-[#558dd6] rounded-full"></div>
                <div className="absolute top-1/2 left-8 w-4 h-4 bg-[#6697d8] rounded-full"></div>
              </div>
            </Link>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase">
                  Find Your Candidates
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  CareerMate Smart Recruitment Platform
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                An AI and Machine Learning–based technology platform in the field of Recruitment Marketing, providing comprehensive solutions that help enterprises address workforce challenges in the digital transformation process—from CV sourcing and resume screening to candidate assessment and performance measurement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Promotion Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase mb-3">
              About Us
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              CareerMate Vietnam
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  CareerMate Vietnam is a leading company in the HR Tech field in Vietnam. Since our early days of establishment and operation, our products have continuously grown.
                </p>
                <p>
                  The CareerMate intelligent recruitment platform, TestCenter employee assessment platform, HappyTime employee experience management platform, and Strings premium recruitment solution.
                </p>
                <p>
                  CareerMate has over 6.3 million users, 190,000 employers and 4 successful partners, connecting millions of candidates to suitable companies every year.
                </p>
                <p>
                  Through continuous research and development of core technology capabilities focused on optimization, CareerMate AI hopes to bring more effective HR solutions in the future.
                </p>
              </div>
            </div>

            <Link
              href="/recruiter/recruiter-feature/services/premium"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              <div className="relative hover:rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                {/* Team illustration */}
                <div className="relative bg-gradient-to-br from-[#0c2426] to-[#6697d8] rounded-2xl h-80">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                      src="/img/home2.png"
                      alt="Team Illustration"
                      className="w-full h-80 object-contain"
                    />
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-60"></div>
                  <div className="absolute bottom-8 left-5 w-10 h-10 bg-[#3573c5] rounded-full opacity-50"></div>
                  <div className="absolute top-1/3 left-4 w-8 h-8 bg-[#6697d8] rounded-full opacity-40"></div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Platform Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Link
              href="/recruiter/recruiter-feature/jobs/create"
              className="block relative hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                {/* 3D illustration placeholder */}
                <div className="relative hover:-rotate-6 transition-transform duration-300 w-full max-w-[500px] mx-auto">
                  <div className="bg-gradient-to-br from-[#bcd1ec] to-[#6b85a7] rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <img
                        src="/img/home1.png"
                        alt="3D Illustration"
                        className="w-full h-80 object-contain p-8"
                      />
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute top-8 -right-4 w-8 h-8 bg-[#6697d8] rounded-full"></div>
                  <div className="absolute bottom-12 -left-6 w-6 h-6 bg-[#558dd6] rounded-full"></div>
                  <div className="absolute top-1/2 left-8 w-4 h-4 bg-[#6697d8] rounded-full"></div>
                </div>
              </div>
            </Link>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase">
                  Posting Recruitment
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  CareerMate Smart Recruitment Platform
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                An AI and Machine Learning–based technology platform in the field of Recruitment Marketing, providing comprehensive solutions that help enterprises address workforce challenges in the digital transformation process—from CV sourcing and resume screening to candidate assessment and performance measurement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="text-[#305c96] font-extrabold text-sm tracking-wider uppercase mb-3">
              MORE FEATURES
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              CareerMate Vietnam
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  CareerMate Vietnam is a leading company in the HR Tech field in Vietnam. From the very early days of its establishment and operation, our products have been developed with a strong focus on innovation and value for businesses.
                </p>
                <p>
                  CareerMate Smart Recruitment Platform, TestCenter Platform for setting up and evaluating employee capabilities, HappyTime Platform for managing and enhancing employee experience, and Strings High-Speed Premium Recruitment Solution.
                </p>
                <p>
                  CareerMate has more than 6.3 million users, 190,000 recruiters, and 4 successful partners with millions of candidates each year at suitable companies.
                </p>
                <p>
                  Through research and continuous development of core technology capabilities centered around deep application of artificial intelligence, AI CareerMate hopes to bring more effective HR solutions in the future.
                </p>
              </div>
            </div>

            <div className="relative group transition-transform duration-500 w-full max-w-[500px] mx-auto">
              {/* Outer rotation and hover effect */}
              <div
                className="relative bg-gradient-to-br from-[#0c2426] to-[#6697d8] rounded-2xl h-80 
                      shadow-lg transform group-hover:rotate-3 group-hover:scale-105 
                      transition-all duration-500 ease-out overflow-hidden"
              >
                {/* Main grid of icons */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8 p-8">
                    {/* Users */}
                    <Link href="/recruiter/recruiter-feature/profile/account">
                      <div
                        className="w-20 h-20 bg-[#c9dffc] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Users className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* Target */}
                    <Link href="/recruiter/recruiter-feature/support/contact">
                      <div
                        className="w-20 h-20 bg-[#bed8f9] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Target className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* TrendingUp */}
                    <Link href="/recruiter/recruiter-feature/dashboard">
                      <div
                        className="w-20 h-20 bg-[#b5ceef] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <TrendingUp className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                    {/* Star */}
                    <Link href="/recruiter/recruiter-feature/services/premium">
                      <div
                        className="w-20 h-20 bg-[#b2cef4] rounded-full flex items-center justify-center 
                            shadow-md hover:scale-110 transition-transform duration-300"
                      >
                        <Star className="h-8 w-8 text-[#6697d8]" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Decorative background circles */}
                <div className="absolute top-4 right-8 w-16 h-16 bg-[#6697d8] rounded-full opacity-50 blur-md"></div>
                <div className="absolute bottom-8 left-5 w-10 h-10 bg-[#3573c5] rounded-full opacity-40 blur-sm"></div>
                <div className="absolute top-1/3 left-4 w-8 h-8 bg-[#6697d8] rounded-full opacity-30 blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3e5570] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#85b9fe]">
                CareerMate
              </h3>
              <p className="text-gray-300">
                Vietnam's leading intelligent recruitment platform
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Post Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Search CVs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Assess Candidates
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Report Bug
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#3588f4]">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

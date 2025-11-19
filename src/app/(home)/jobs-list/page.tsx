"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { ClientHeader, ClientFooter } from "@/modules/client/components";

// Example static job data
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Solutions',
    location: 'Hanoi',
    description: 'Build and maintain web applications using React and Next.js.'
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'Innovatech',
    location: 'Ho Chi Minh City',
    description: 'Develop RESTful APIs and work with databases.'
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Da Nang',
    description: 'Design user interfaces and improve user experience.'
  }
];

export default function Page() {
  return (
    <>
      <ClientHeader />
      
      <main className="py-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Available Jobs</h1>
        <ul className="space-y-6">
          {jobs.map(job => (
            <li key={job.id} className="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#3a4660] mb-2">{job.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-600 font-medium">{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">{job.location}</span>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">Posted 2 days ago</span>
                  <button className="bg-gradient-to-r from-[#3a4660] to-gray-400 text-white rounded-md px-4 py-2 hover:bg-gradient-to-r hover:from-[#3a4660] hover:to-[#3a4660] transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
      
      <ClientFooter />
    </>
  );
}

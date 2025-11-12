// "use client";

// import { useEffect, useState, type ReactNode } from "react";
// import { RecruiterHeader } from "../../client/components/RecruiterHeader";
// import { RecruiterFooter } from "../../client/components/RecruiterFooter";
// import { RecruiterSidebar } from "./RecruiterSidebar";

// interface RecruiterLayoutWrapperProps {
//     children: ReactNode;
// }

// export function RecruiterLayoutWrapper({ children }: RecruiterLayoutWrapperProps) {
//     const [sidebarOpen, setSidebarOpen] = useState(false); // Always start with false for SSR consistency
//     const [isHydrated, setIsHydrated] = useState(false);

//     useEffect(() => {
//         // Set hydrated flag and initialize sidebar state from localStorage
//         setIsHydrated(true);
//         const savedState = localStorage.getItem('sidebar-open');
//         if (savedState !== null) {
//             setSidebarOpen(savedState === 'true');
//         }

//         // Listen for explicit toggle events
//         const handleSidebarToggle = () => {
//             const isOpen = localStorage.getItem('sidebar-open') === 'true';
//             setSidebarOpen(isOpen);
//         };

//         window.addEventListener('sidebar-toggle', handleSidebarToggle);

//         return () => {
//             window.removeEventListener('sidebar-toggle', handleSidebarToggle);
//         };
//     }, []);

//     return (
//         <div className="min-h-screen bg-white flex">
//             <RecruiterSidebar />
//             <div className="flex-1 flex flex-col">
//                 <RecruiterHeader sidebarOpen={sidebarOpen} />
//                 <main
//                     className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'
//                         }`}
//                 >
//                     <div className="px-4 py-8">
//                         <div className="mx-auto max-w-6xl">
//                             {children}
//                         </div>
//                     </div>
//                 </main>
//                 <RecruiterFooter sidebarOpen={sidebarOpen} />
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RecruiterHeader } from "./RecruiterHeader";
import { RecruiterFooter } from "./RecruiterFooter";
import { RecruiterSidebar } from "./RecruiterSidebar";

interface RecruiterLayoutWrapperProps {
    children: ReactNode;
}

export function RecruiterLayoutWrapper({ children }: RecruiterLayoutWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Always start with false for SSR consistency
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Set hydrated flag and initialize sidebar state from localStorage
        setIsHydrated(true);
        const savedState = localStorage.getItem('sidebar-open');
        if (savedState !== null) {
            setSidebarOpen(savedState === 'true');
        }

        // Listen for explicit toggle events
        const handleSidebarToggle = () => {
            const isOpen = localStorage.getItem('sidebar-open') === 'true';
            setSidebarOpen(isOpen);
        };

        window.addEventListener('sidebar-toggle', handleSidebarToggle);

        return () => {
            window.removeEventListener('sidebar-toggle', handleSidebarToggle);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white flex">
            <RecruiterSidebar />
            <div className="flex-1 flex flex-col">
                <RecruiterHeader sidebarOpen={sidebarOpen} />
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'
                        }`}
                >
                    <div className="px-4 py-8">
                        <div className="mx-auto max-w-6xl">
                            {children}
                        </div>
                    </div>
                </main>
                <RecruiterFooter sidebarOpen={sidebarOpen} />
            </div>
        </div>
    );
}


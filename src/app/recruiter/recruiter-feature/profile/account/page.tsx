"use client";

import { AccountTabs, RecruiterAccountForm } from "@/modules/recruiter";

export default function RecruiterAccountPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-2 text-gray-600">Manage your recruiter account information</p>
            </div>

            <AccountTabs />
            <RecruiterAccountForm />
        </>
    );
}

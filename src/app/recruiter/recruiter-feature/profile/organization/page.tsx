"use client";

import { AccountTabs, OrganizationProfileForm } from "@/modules/recruiter";

export default function OrganizationProfilePage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-2 text-gray-600">Manage your organization profile information</p>
            </div>

            <AccountTabs />
            <OrganizationProfileForm />
        </>
    );
}

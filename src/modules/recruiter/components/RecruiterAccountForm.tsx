"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Toggle } from "./RecruiterToggle";
import { AvatarPicker } from "./AvatarPicker";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { ProfileService } from "../services/profileService";
import type { Recruiter } from "@/types/recruiter";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";

export function RecruiterAccountForm() {
    const [openPwd, setOpenPwd] = useState(false);
    const [recruiterData, setRecruiterData] = useState<Recruiter | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        contactPerson: "",
    });

    useEffect(() => {
        const fetchRecruiterData = async () => {
            try {
                setLoading(true);
                if (user?.email) {
                    const data = await ProfileService.getRecruiterAccount(user.email);
                    if (data) {
                        setRecruiterData(data);
                        setFormData({
                            username: data.username || "",
                            email: data.email || "",
                            phoneNumber: data.phoneNumber || "",
                            contactPerson: data.contactPerson || "",
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching recruiter data:", error);
                toast.error("Failed to load recruiter data");
            } finally {
                setLoading(false);
            }
        };

        fetchRecruiterData();
    }, [user?.email]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSavePersonalInfo = async () => {
        try {
            await ProfileService.updateRecruiterAccount({
                username: formData.username,
                phoneNumber: formData.phoneNumber,
                contactPerson: formData.contactPerson,
            });
            toast.success("Personal information updated successfully");
        } catch (error) {
            console.error("Error updating personal info:", error);
            toast.error("Failed to update personal information");
        }
    };

    if (loading) {
        return (
            <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
                <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </section>
        );
    }
    return (
        <section className="rounded-lg border bg-white p-6 shadow-sm shadow-sky-100">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                <div>
                    <div className="mb-6 rounded-md bg-sky-50 p-4 text-sm text-sky-900">
                        <p>
                            Complete your company details and verification. Your information helps us review and activate your recruiter account.
                        </p>
                    </div>

                    <form className="space-y-6">
                        {/* Personal Information */}
                        <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                                Personal Information
                            </h4>
                            <fieldset className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-sky-900">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500"
                                    placeholder="Enter your username"
                                />
                            </fieldset>

                            <fieldset className="space-y-3 mb-4">
                                <label className="block text-sm font-medium text-sky-900">
                                    Work Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    readOnly
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className="w-full cursor-not-allowed rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                                />
                            </fieldset>

                            <fieldset className="space-y-3 mb-4">
                                <label className="block text-sm font-medium text-sky-900">Password</label>
                                <input
                                    readOnly
                                    type="password"
                                    className="w-full cursor-not-allowed rounded-md border bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                                    defaultValue="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setOpenPwd(true)}
                                    className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium text-sky-800 hover:bg-sky-50"
                                >
                                    Change password
                                </button>
                            </fieldset>

                            {/* <fieldset className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-sky-900">
                                    Contact Person <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500"
                                    placeholder="Enter contact person name"
                                />
                            </fieldset>

                            <fieldset className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-sky-900">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-sky-500"
                                    placeholder="0929098765"
                                />
                            </fieldset> */}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleSavePersonalInfo}
                                className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-md bg-sky-50 p-4 text-center">
                        <p className="mb-4 text-sm font-medium text-sky-900">Profile avatar</p>
                        <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border">
                            <Image
                                src={recruiterData?.logoUrl || "/globe.svg"}
                                alt="Avatar"
                                width={112}
                                height={112}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <AvatarPicker />
                        <p className="mt-2 text-xs text-muted-foreground">Recommended size 1000x1000px, ≤ 1MB</p>
                    </div>

                    {recruiterData && (
                        <div className="rounded-md bg-white border p-4">
                            <h3 className="text-sm font-semibold text-sky-900 mb-3">Account Status</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span
                                        className={`font-medium ${
                                            recruiterData.accountStatus === "ACTIVE"
                                                ? "text-green-600"
                                                : recruiterData.accountStatus === "PENDING"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {recruiterData.accountStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role:</span>
                                    <span className="font-medium">{recruiterData.accountRole}</span>
                                </div>
                                {recruiterData.rating > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Rating:</span>
                                        <span className="font-medium">{recruiterData.rating}/5</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
            <ChangePasswordDialog open={openPwd} onClose={() => setOpenPwd(false)} />
        </section>
    );
}

export default RecruiterAccountForm;



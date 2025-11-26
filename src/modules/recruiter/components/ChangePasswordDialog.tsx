"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Lock } from "lucide-react";
import { changePassword } from "@/lib/recruiter-api";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "react-hot-toast";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ChangePasswordDialog({ open, onClose }: Props) {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();
    
    // Debug: log user when dialog opens
    useEffect(() => {
        if (open) {
            console.log("🔍 [Change Password Dialog] User from store:", user);
            console.log("🔍 [Change Password Dialog] User email:", user?.email);
            console.log("🔍 [Change Password Dialog] User username:", user?.username);
        }
    }, [open, user]);
    
    const [formData, setFormData] = useState({
        password: "",
        repeatPassword: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        repeatPassword: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validateForm = (): boolean => {
        const newErrors = {
            password: "",
            repeatPassword: "",
        };

        let isValid = true;

        if (!formData.password.trim()) {
            newErrors.password = "New password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!formData.repeatPassword.trim()) {
            newErrors.repeatPassword = "Please confirm your new password";
            isValid = false;
        } else if (formData.password !== formData.repeatPassword) {
            newErrors.repeatPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Try to get email from multiple sources
        const userEmail = user?.email || user?.username;
        
        // If still no email, try to get from localStorage/sessionStorage
        let email = userEmail;
        if (!email) {
            try {
                const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    email = parsedUser.email || parsedUser.username;
                }
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }

        console.log("🔍 [Change Password] User email:", email);
        console.log("🔍 [Change Password] User object:", user);

        if (!email) {
            toast.error("User email not found. Please login again.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const response = await changePassword(email, {
                password: formData.password,
                repeatPassword: formData.repeatPassword,
            });

            if (response.code === 200 || response.code === 0) {
                toast.success("Password changed successfully!");
                handleClose();
            } else {
                toast.error(response.message || "Failed to change password");
            }
        } catch (error: any) {
            console.error("Change password error:", error);
            toast.error(error.message || "Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            password: "",
            repeatPassword: "",
        });
        setErrors({
            password: "",
            repeatPassword: "",
        });
        setShow1(false);
        setShow2(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-sky-100 rounded-lg">
                            <Lock className="h-5 w-5 text-sky-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-sky-900">Change Password</h2>
                    </div>
                    <button 
                        aria-label="Close" 
                        onClick={handleClose} 
                        className="rounded p-1 text-slate-600 hover:bg-slate-100"
                        disabled={isSubmitting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-xs text-amber-800">
                        <span className="font-semibold">Note:</span> You will be logged out after changing your password. Please login again with your new password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field 
                        label="New Password" 
                        required 
                        helper="Password must be at least 6 characters"
                        error={errors.password}
                    >
                        <PasswordInput 
                            value={formData.password}
                            onChange={(value) => handleChange("password", value)}
                            show={show1} 
                            onToggle={() => setShow1((s) => !s)} 
                            placeholder="Enter new password"
                            disabled={isSubmitting}
                        />
                    </Field>
                    
                    <Field 
                        label="Confirm New Password" 
                        required
                        error={errors.repeatPassword}
                    >
                        <PasswordInput 
                            value={formData.repeatPassword}
                            onChange={(value) => handleChange("repeatPassword", value)}
                            show={show2} 
                            onToggle={() => setShow2((s) => !s)} 
                            placeholder="Confirm new password"
                            disabled={isSubmitting}
                        />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            className="inline-flex h-10 flex-1 items-center justify-center rounded-md border px-4 text-sm font-medium text-sky-800 hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Changing...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ 
    label, 
    required, 
    helper, 
    error,
    children 
}: { 
    label: string; 
    required?: boolean; 
    helper?: string; 
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
            {!error && helper && <p className="text-xs text-slate-500">{helper}</p>}
        </div>
    );
}

function PasswordInput({ 
    value, 
    onChange,
    show, 
    onToggle, 
    placeholder,
    disabled 
}: { 
    value: string;
    onChange: (value: string) => void;
    show: boolean; 
    onToggle: () => void; 
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
                type="button" 
                onClick={onToggle} 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed" 
                aria-label="Toggle password visibility"
                disabled={disabled}
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}



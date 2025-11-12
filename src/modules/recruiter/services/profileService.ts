import type { RecruiterProfile, OrganizationProfile } from "../types";
import type { Recruiter } from "@/types/recruiter";
import api from "@/lib/api";

export class ProfileService {
    static async getRecruiterProfile(): Promise<RecruiterProfile> {
        // TODO: Implement API call
        return {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
            bio: "Experienced recruiter with 5+ years in tech recruitment"
        };
    }

    static async updateRecruiterProfile(profile: Partial<RecruiterProfile>): Promise<RecruiterProfile> {
        // TODO: Implement API call
        console.log("Updating recruiter profile:", profile);
        return this.getRecruiterProfile();
    }

    static async getOrganizationProfile(): Promise<OrganizationProfile> {
        // TODO: Implement API call
        return {
            companyName: "TechCorp Inc.",
            industry: "Technology",
            companySize: "50-100",
            website: "https://techcorp.com",
            description: "Leading technology company specializing in software development",
            address: "123 Tech Street",
            city: "San Francisco",
            country: "United States"
        };
    }

    static async updateOrganizationProfile(profile: Partial<OrganizationProfile>): Promise<OrganizationProfile> {
        // TODO: Implement API call
        console.log("Updating organization profile:", profile);
        return this.getOrganizationProfile();
    }

    static async getRecruiterAccount(email: string): Promise<Recruiter | null> {
        try {
            const response = await api.get<{
                code: number;
                message: string;
                result: Recruiter[];
            }>("/api/admin/recruiters");

            if (response.data.code === 200 && response.data.result) {
                // Tìm recruiter theo email
                const recruiter = response.data.result.find(
                    (r) => r.email === email
                );
                return recruiter || null;
            }
            return null;
        } catch (error) {
            console.error("Error fetching recruiter account:", error);
            throw error;
        }
    }

    static async updateRecruiterAccount(data: Partial<Recruiter>): Promise<void> {
        try {
            // TODO: Implement update API endpoint
            console.log("Updating recruiter account:", data);
        } catch (error) {
            console.error("Error updating recruiter account:", error);
            throw error;
        }
    }
}

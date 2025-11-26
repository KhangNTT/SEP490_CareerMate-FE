import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must include at least one uppercase letter",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must include at least one lowercase letter",
  })
  .refine((value) => /[^A-Za-z0-9]/.test(value), {
    message: "Password must include at least one special character",
  });

export const signUpCandidateFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" }),
  dob: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }, { message: "Invalid date format" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Email must end with @gmail.com",
    }),
  password: passwordSchema,
  terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the Terms and Conditions",
  }),
});

export type SignUpCandidateFormValues = z.infer<typeof signUpCandidateFormSchema>;

const useSignUpCandidateHook = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpCandidateFormValues>({
    resolver: zodResolver(signUpCandidateFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      dob: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (values: SignUpCandidateFormValues) => {
    try {
      const payload = {
        fullName: values.username,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dob, // Format: "2005-11-24"
      };

      const response = await api.post("/api/users/sign-up", payload);

      if (response.status >= 200 && response.status < 300) {
        toast.success("Candidate account created successfully!");
        
        form.reset({
          username: "",
          dob: "",
          email: "",
          password: "",
          terms: false,
        });
        setShowPassword(false);
        router.push("/sign-in");
        return;
      }

      toast.error("Failed to create account. Please try again.");
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Failed to create account. Please try again.";
      toast.error(message);
    }
  };
  
  useEffect(() => {
    const firstError = Object.keys(form.formState.errors)[0];
    if (firstError) {
      const field = document.querySelector(
        `[name="${firstError}"]`
      ) as HTMLElement;
      field?.focus();
    }
  }, [form.formState.errors]);

  return {
    form,
    onSubmit,
    showPassword,
    togglePasswordVisibility,
  };
};

export default useSignUpCandidateHook;

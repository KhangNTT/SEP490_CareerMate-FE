"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSignUpRecruiterHook from "@/modules/client/auth/hooks/use-sign-up-recruiter-hooks";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

export default function SignUpRecruiterForm() {
  const router = useRouter();
  const { form, onSubmit, showPassword, togglePasswordVisibility } =
    useSignUpRecruiterHook();
  const { isSubmitting } = form.formState;
  const termsAccepted = form.watch("terms");

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to role selection
              </button>

              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Create Recruiter Account
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Join us to find the best talents
              </p>

              {/* Google OAuth Button */}
              <div className="mb-6">
                <GoogleOAuthButton 
                  accountType="recruiter" 
                  label="Sign up with Google (Recruiter)"
                />
              </div>

              <div className="mb-6 flex items-center justify-center">
                <span className="bg-body-color block h-px w-full max-w-[70px]"></span>
                <p className="w-full px-5 text-center text-base font-medium text-body-color">
                  Or sign up with email
                </p>
                <span className="bg-body-color block h-px w-full max-w-[70px]"></span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                      Personal Information
                    </h4>
                    
                    {/* Username */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Username <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="username"
                                placeholder="Enter your username"
                                autoComplete="username"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.username &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Work Email <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                id="email"
                                placeholder="Enter your work email"
                                autoComplete="email"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.email &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Password <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  id="password"
                                  placeholder="Enter your password"
                                  autoComplete="new-password"
                                  className={cn(
                                    "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                    form.formState.errors.password &&
                                      "border-destructive focus:border-destructive text-destructive"
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="group absolute top-1/2 right-0 h-full -translate-y-1/2 px-3 py-2 hover:bg-transparent"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <EyeOff className="text-muted-foreground size-5 group-hover:text-blue-600" />
                                  ) : (
                                    <Eye className="text-muted-foreground size-5 group-hover:text-blue-600" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Organization Information Section */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">
                      Organization Information
                    </h4>

                    {/* Company Name */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Company Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="companyName"
                                placeholder="e.g., FPT Corporation"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.companyName &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Website */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Website (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.website &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Logo URL */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Company Logo URL (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="logoUrl"
                                type="url"
                                placeholder="https://example.com/logo.png"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.logoUrl &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Company Email */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="companyEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Company Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="companyEmail"
                                type="email"
                                placeholder="e.g., contact@company.com"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.companyEmail &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Contact Person <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="contactPerson"
                                placeholder="Enter contact person name"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.contactPerson &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Phone Number <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="phoneNumber"
                                type="tel"
                                placeholder="0929098765"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.phoneNumber &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Company Address */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="companyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              Company Address <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="companyAddress"
                                placeholder="e.g., Ftown1"
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                  form.formState.errors.companyAddress &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* About Company */}
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                              About Company <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                id="about"
                                placeholder="Describe your company, mission, or culture..."
                                rows={4}
                                className={cn(
                                  "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300 w-full resize-none",
                                  form.formState.errors.about &&
                                    "border-destructive focus:border-destructive text-destructive"
                                )}
                              />
                            </FormControl>
                            <FormMessage className="mt-1 text-sm text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Date of birth - REMOVED */}
                  {/* Email - MOVED UP */}
                  {/* Password - MOVED UP */}

                  {/* Terms */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <label className="text-body-color flex cursor-pointer text-sm font-medium select-none">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="mr-3 h-4 w-4 accent-primary"
                              />
                              <span>
                                <span className="text-destructive mr-1">*</span>
                                By creating account means you agree to the
                                <a
                                  href="#0"
                                  className="text-primary hover:underline"
                                >
                                  {" "}
                                  Terms and Conditions{" "}
                                </a>
                                and our
                                <a
                                  href="#0"
                                  className="text-primary hover:underline"
                                >
                                  {" "}
                                  Privacy Policy
                                </a>
                              </span>
                            </label>
                          </FormControl>
                          <FormMessage className="mt-1 text-sm text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300"
                  >
                    {isSubmitting ? "Creating account..." : "Sign up as Recruiter"}
                  </Button>
                </form>
              </Form>

              <p className="text-body-color text-center text-base font-medium mt-6">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

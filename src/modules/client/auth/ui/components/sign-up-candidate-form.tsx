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
import useSignUpCandidateHook from "@/modules/client/auth/hooks/use-sign-up-candidate-hooks";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";

export default function SignUpCandidateForm() {
  const router = useRouter();
  const { form, onSubmit, showPassword, togglePasswordVisibility } =
    useSignUpCandidateHook();
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
                Create Candidate Account
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Join us to find your dream job
              </p>

              {/* Google OAuth Button */}
              <div className="mb-6">
                <GoogleOAuthButton 
                  accountType="candidate" 
                  label="Sign up with Google"
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
                  {/* Full Name */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                            Full Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="username"
                              placeholder="Enter your full name"
                              autoComplete="name"
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

                  {/* Date of birth */}
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dark mb-2 block text-sm dark:text-white">
                            Date of Birth <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              id="dob"
                              max={new Date().toISOString().split('T')[0]}
                              className={cn(
                                "border-stroke rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base text-body-color dark:text-body-color-dark dark:shadow-two dark:border-transparent dark:bg-[#2C303B] focus:border-primary dark:focus:border-primary transition-all duration-300",
                                form.formState.errors.dob &&
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
                            Email{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              id="email"
                              placeholder="Enter your email"
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
                            Your Password{" "}
                            <span className="text-destructive">*</span>
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
                    {isSubmitting ? "Creating account..." : "Sign up as Candidate"}
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

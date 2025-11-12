import z from "zod";

export const RegisterBody = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    fullName: z.string().min(1, "Full name is required"),
    
}).strict().superRefine(({confirmPassword,password}, ctx) => {
    if(confirmPassword !== password){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"]});
    }
});
export type RegisterBodyType = z.infer<typeof RegisterBody>;
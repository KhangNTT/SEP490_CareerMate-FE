import z from "zod";

export const configSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
})

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if(!configProject.success){
    console.error("Invalid environment variables", configProject.error.format());
    throw new Error("Invalid environment variables");
}
const envConfig = configProject.data;
export default envConfig;
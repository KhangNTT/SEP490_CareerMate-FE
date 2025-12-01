import CompleteRecruiterPageContent from "./CompleteRecruiterPageContent";

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function CompleteRecruiterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email || null;

  return <CompleteRecruiterPageContent email={email} />;
}

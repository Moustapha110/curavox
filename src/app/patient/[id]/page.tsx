import type { Metadata, Viewport } from "next";
import { PatientChat } from "@/components/chat/PatientChat";
import { getDrug } from "@/data/metformin";
import { parseCompanionSearchParams } from "@/lib/companion";

type SearchParams = Record<string, string | string[] | undefined>;

interface PatientPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: PatientPageProps): Promise<Metadata> {
  const sp = await props.searchParams;
  const p = parseCompanionSearchParams(sp);
  return {
    title: `${getDrug(p.drug).drugName} companion`,
    description: "Your CuraVox medication companion.",
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#FBF8F1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default async function PatientCompanionPage(props: PatientPageProps) {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const companion = parseCompanionSearchParams(sp);
  return <PatientChat companion={{ id, ...companion }} />;
}

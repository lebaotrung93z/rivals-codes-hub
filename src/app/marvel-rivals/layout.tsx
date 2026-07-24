import { ContentFrame } from "@/components/SiteChrome";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <ContentFrame>{children}</ContentFrame>;
}

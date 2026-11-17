import SettingsEditor from "@/components/admin/SettingsEditor";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "hero" } = await searchParams;
  return <SettingsEditor key={tab} tab={tab} />;
}

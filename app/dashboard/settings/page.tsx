import { Metadata } from "next";
import { SettingsContainer } from "./components/settings-container";

export const metadata: Metadata = {
  title: "Settings | CloudDojo",
  description: "Manage your account settings, subscription, and preferences.",
};

export default function SettingsPage() {
  return <SettingsContainer />;
}
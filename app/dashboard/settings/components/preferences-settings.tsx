"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeSelector } from "./theme-selector";

export function PreferencesSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  const handleSavePreferences = () => {
    // Here you would typically save to your backend
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6">
      {/* Theme Selector */}
      <ThemeSelector />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-dashed">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Email Notifications</Label>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Push Notifications</Label>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Weekly Progress Report</Label>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Marketing Emails</Label>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-base font-semibold">Language & Region</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-sm">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    <SelectItem value="PST">Pacific Time (GMT-8)</SelectItem>
                    <SelectItem value="EST">Eastern Time (GMT-5)</SelectItem>
                    <SelectItem value="CET">Central European (GMT+1)</SelectItem>
                    <SelectItem value="JST">Japan Time (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-start">
        <Button onClick={handleSavePreferences} size="sm" className="gap-2">
          <Save className="h-3.5 w-3.5" />
          Save preferences
        </Button>
      </div>
    </div>
  );
}

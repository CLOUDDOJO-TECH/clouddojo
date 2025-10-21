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

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences and email settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive important updates about your account and progress.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about quiz reminders and achievements.
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Weekly Progress Report
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive a summary of your learning progress each week.
                </p>
              </div>
              <Switch
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Marketing Emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and special offers.
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Set your preferred language and regional settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="fr">🇫🇷 Français</SelectItem>
                  <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                  <SelectItem value="pt">🇵🇹 Português</SelectItem>
                  <SelectItem value="zh">🇨🇳 中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="PST">Pacific Time (GMT-8)</SelectItem>
                  <SelectItem value="EST">Eastern Time (GMT-5)</SelectItem>
                  <SelectItem value="CET">
                    Central European Time (GMT+1)
                  </SelectItem>
                  <SelectItem value="JST">Japan Time (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Preferences</CardTitle>
          <CardDescription>
            Customize your learning experience and study settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Default Quiz Length
              </Label>
              <Select defaultValue="20">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="50">50 questions</SelectItem>
                  <SelectItem value="100">100 questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Difficulty Level</Label>
              <Select defaultValue="mixed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Show Explanations Immediately
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display answer explanations right after each question.
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Randomize Questions
                </Label>
                <p className="text-sm text-muted-foreground">
                  Present questions in random order for each quiz session.
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gradient" onClick={handleSavePreferences} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Preferences
        </Button>
      </div>
    </div>
  );
}

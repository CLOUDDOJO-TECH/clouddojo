"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, CreditCard, Bell } from "lucide-react";
import { AccountSettings } from "./account-settings";
import { SubscriptionSettings } from "./subscription-settings";
import { PreferencesSettings } from "./preferences-settings";

export function SettingsContainer() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, subscription, and application preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="account" className="text-sm">
            Account
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-sm">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="preferences" className="text-sm">
            Preferences
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[600px]">
          <TabsContent value="account" className="space-y-6 m-0">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 m-0">
            <SubscriptionSettings />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 m-0">
            <PreferencesSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
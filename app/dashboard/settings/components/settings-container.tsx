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
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex w-auto rounded-lg bg-transparent p-0 gap-1 border border-dashed border-border/60 p-1">
          <TabsTrigger value="account" className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-sidebar-accent/40 hover:text-sidebar-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-foreground data-[state=active]:shadow-md">
            <User className="h-3.5 w-3.5" />
            Account
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-sidebar-accent/40 hover:text-sidebar-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-foreground data-[state=active]:shadow-md">
            <CreditCard className="h-3.5 w-3.5" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 px-5 py-1.5 text-sm rounded-md transition-all duration-300 ease-in-out hover:bg-sidebar-accent/40 hover:text-sidebar-foreground data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-foreground data-[state=active]:shadow-md">
            <Settings className="h-3.5 w-3.5" />
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
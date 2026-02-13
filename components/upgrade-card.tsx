"use client";

import { Card } from "@/components/ui/card";
import UpgradeButton from "./ui/upgrade-button";

export default function UpgradeCard() {
  return (
    <Card className="border border-border/70 rounded-xl p-5 flex flex-col items-center gap-3">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-lg italic font-light font-kaushan text-neutral-200">
          Upgrade to{" "}
          <span className="italic text-primary">Pro.</span>
        </h2>
        <p className="text-xs text-neutral-400 tracking-wide">
          Get access full access right now
        </p>
      </div>
      <UpgradeButton size="sm" variant="primary">
        Upgrade plan
      </UpgradeButton>
    </Card>
  );
}

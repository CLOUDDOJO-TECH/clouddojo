"use client";

import { InfoIcon } from "lucide-react";
import {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerAction,
  BannerClose,
} from "@/components/kibo-ui/banner";
import Link from "next/link";

export function LabsBanner() {
  return (
    <Banner className="bg-blue-600 text-white dark:bg-blue-700 rounded-tl-xl">
      <BannerIcon icon={InfoIcon} />
      <BannerTitle>
        Project Labs is currently in{" "}
        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-white/30 font-kaushan">
          beta
        </span>
        . If you encounter any issues or bugs, please report them as feedback.
      </BannerTitle>
      <BannerAction asChild>
        <Link href="/dashboard/settings?tab=feedback">Report Feedback</Link>
      </BannerAction>
      <BannerClose />
    </Banner>
  );
}

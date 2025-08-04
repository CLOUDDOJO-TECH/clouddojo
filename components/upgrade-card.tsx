"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import UpgradeButton from "./ui/upgrade-button";

export default function UpgradeCard() {
  return (
    <Card className="relative h-[254px] border-none overflow-hidden rounded-3xl hover:shadow-md transition-shadow duration-300 after:z-10 after:content-[''] after:absolute after:inset-0 after:outline-2 after:outline after:-outline-offset-2 after:rounded-3xl after:outline-white/20 after:pointer-events-none">
      <div className="absolute inset-0">
        <Image
          src="/images/upgrade-bg.png"
          alt="underwater-background"
          className="object-cover object-[center_20%] brightness-75 opacity-90"
          fill
          sizes="(max-width: 460px) 100vw, 460px"
          priority
        />
      </div>
      <div className="absolute inset-0  from-transparent via-foreground/80 to-foreground p-6 flex flex-col justify-between w-full gap-2">
        <div className="flex flex-col h-full justify-end">
          <span className="flex flex-col gap-1 justify-center items-center wfull">
            <div className="flex flex-col gap-1">
              <h1 className="text-md font-light text-neutral-200 text-center pb-2">
                Upgrade to{" "}
                <span className="italic font-kaushan text-primary">Pro.</span>
              </h1>
              <p className="text-[12px] text-neutral-400 text-center tracking-wide">
                Get access to the advanced AI features and weekly mails.
              </p>
            </div>
            {/* <button
          className="rounded-full bg-gradient-to-b from-primary/80 to-primary text-white font-medium w-fit px-[13px] py-[4px] text-[11px] font-serif mt-2"
        >
          Upgrade plan
        </button> */}
            <UpgradeButton className="mt-2" size="sm" variant="primary">
              Upgrade plan
            </UpgradeButton>
          </span>
        </div>
      </div>
    </Card>
  );
}

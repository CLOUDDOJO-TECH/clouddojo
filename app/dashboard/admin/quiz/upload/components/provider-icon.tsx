"use client";

import React from "react";
import Image from "next/image";
import {
  AmazonWebServices,
  GitHub,
  Ansible,
  Jenkins,
  Helm,
} from "../lib/provider-icons";

interface ProviderIconProps {
  provider: string;
  logoUrl: string | null;
  onError?: () => void;
  className?: string;
}

export function ProviderIcon({
  provider,
  logoUrl,
  onError,
  className = "w-4 h-4",
}: ProviderIconProps) {
  // Render AWS icon
  if (provider === "AWS") {
    return <AmazonWebServices className={className} />;
  }

  // Render GitHub Actions icon
  if (provider === "GitHub Actions") {
    return <GitHub className={className} />;
  }

  // Render Ansible icon
  if (provider === "Ansible") {
    return <Ansible className={className} />;
  }

  // Render Jenkins icon
  if (provider === "Jenkins") {
    return <Jenkins className={className} />;
  }

  // Render Helm icon
  if (provider === "Helm") {
    return <Helm className={className} />;
  }

  // Use Image component for URL-based logos
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={16}
        height={16}
        className={`${className} object-contain flex-shrink-0`}
        onError={onError}
        unoptimized
      />
    );
  }

  // No icon available
  return null;
}

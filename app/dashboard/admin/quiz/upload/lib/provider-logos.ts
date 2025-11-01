/**
 * Provider logo mapping using SVGL API and custom SVG components
 * Static mapping to avoid rate limits and ensure consistent results
 */

export const PROVIDER_LOGOS: Record<string, string> = {
  Azure: "https://svgl.app/library/azure.svg",
  GCP: "https://svgl.app/library/google-cloud.svg",
  "Oracle Cloud": "https://svgl.app/library/oracle.svg",
  Kubernetes: "https://svgl.app/library/kubernetes.svg",
  Docker: "https://svgl.app/library/docker.svg",
  Terraform: "https://svgl.app/library/terraform.svg",
  "GitLab CI": "https://svgl.app/library/gitlab.svg",
  CompTIA: "https://svgl.app/library/comptia.svg",
  Cisco: "https://svgl.app/library/cisco.svg",
  "Red Hat": "https://svgl.app/library/redhat.svg",
  VMware: "https://svgl.app/library/vmware.svg",
  HashiCorp: "https://svgl.app/library/hashicorp.svg",
};

/**
 * Providers that use custom SVG components instead of URLs
 */
export const CUSTOM_SVG_PROVIDERS = [
  "AWS",
  "GitHub Actions",
  "Ansible",
  "Jenkins",
  "Helm",
  "SANS",
] as const;

/**
 * Get the logo URL for a provider
 * @param provider - The provider name
 * @returns The logo URL or null if not found or if it uses a custom SVG component
 */
export function getProviderLogo(provider: string): string | null {
  // Check if provider uses custom SVG component
  if (CUSTOM_SVG_PROVIDERS.includes(provider as any)) {
    return null; // Will be handled by custom SVG component
  }

  return PROVIDER_LOGOS[provider] || null;
}

/**
 * Check if a provider has a logo available (either URL or custom SVG)
 * @param provider - The provider name
 * @returns True if logo is available
 */
export function hasProviderLogo(provider: string): boolean {
  return (
    provider in PROVIDER_LOGOS || CUSTOM_SVG_PROVIDERS.includes(provider as any)
  );
}

/**
 * Check if a provider uses a custom SVG component
 * @param provider - The provider name
 * @returns True if provider uses custom SVG component
 */
export function usesCustomSVG(provider: string): boolean {
  return CUSTOM_SVG_PROVIDERS.includes(provider as any);
}

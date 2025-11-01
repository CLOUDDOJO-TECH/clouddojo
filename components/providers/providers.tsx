"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { PricingModalProvider } from "./pricing-modal-provider";
import { dark } from "@clerk/themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <PricingModalProvider>
          {children}
          <Toaster />
        </PricingModalProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default Providers;

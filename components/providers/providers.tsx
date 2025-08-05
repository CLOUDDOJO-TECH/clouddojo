"use client"
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { PricingModalProvider } from "./pricing-modal-provider";

export const Providers = ({ children }: { children: React.ReactNode}) => {
  const queryClient = new QueryClient();
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <PricingModalProvider>
          {children}
          <Toaster position="top-right" />
        </PricingModalProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Providers;
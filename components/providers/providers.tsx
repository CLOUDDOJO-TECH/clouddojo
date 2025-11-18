"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Toaster } from "@/components/ui/sonner";
import { PricingModalProvider } from "./pricing-modal-provider";
import { AmplitudeProvider } from "./amplitude-provider";
import { dark } from "@clerk/themes";
import { trpc } from "@/src/lib/trpc/react";
import { useState } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // Create QueryClient with optimized defaults
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Data fresh for 1 minute
            refetchOnWindowFocus: false, // Don't refetch on window focus
          },
        },
      }),
  );

  // Create tRPC client
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AmplitudeProvider>
            <PricingModalProvider>
              {children}
              <Toaster />
            </PricingModalProvider>
          </AmplitudeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ClerkProvider>
  );
};

export default Providers;


"use client"
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export  const Providers = ({ children }: { children: React.ReactNode}) => {
  const queryClient = new QueryClient();
  return (
    <ClerkProvider>
        <QueryClientProvider client={queryClient}>
         <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </QueryClientProvider>
    </ClerkProvider>
  );
}

export default Providers;
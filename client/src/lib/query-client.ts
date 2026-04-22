import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Prevents refetching when switching back to the app tab
            retry: 1, // Retries a failed request once
            staleTime: 5 * 60 * 1000, // Data remains "fresh" for 5 minutes
        },
    },
});

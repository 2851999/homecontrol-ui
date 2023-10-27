"use client";
import CustomThemeProvider from "../theme/CustomThemeProvider";
import { CustomStoreProvider } from "..//state/CustomStoreProvider";
import { AuthenticationProvider } from "../components/AuthenticationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout(props: { children: any }) {
  const { children } = props;

  // QueryClientProvider requires client side for now
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body>
        <CustomStoreProvider waitToLoad={true}>
          <CustomThemeProvider>
            <QueryClientProvider client={queryClient}>
              <AuthenticationProvider>{children}</AuthenticationProvider>
            </QueryClientProvider>
          </CustomThemeProvider>
        </CustomStoreProvider>
      </body>
    </html>
  );
}

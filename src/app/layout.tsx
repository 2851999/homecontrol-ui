"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/en-gb";
import { CustomStoreProvider } from "..//state/CustomStoreProvider";
import { AuthenticationProvider } from "../components/AuthenticationProvider";
import { HomeControlAppBar } from "../components/HomeControlAppBar";
import CustomThemeProvider from "../theme/CustomThemeProvider";

export default function RootLayout(props: { children: any }) {
  const { children } = props;

  // QueryClientProvider requires client side for now
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <CustomStoreProvider waitToLoad={true}>
          <CustomThemeProvider>
            <QueryClientProvider client={queryClient}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <AuthenticationProvider>
                  <HomeControlAppBar />
                  {children}
                </AuthenticationProvider>
              </LocalizationProvider>
            </QueryClientProvider>
          </CustomThemeProvider>
        </CustomStoreProvider>
      </body>
    </html>
  );
}

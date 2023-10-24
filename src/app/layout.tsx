import CustomThemeProvider from "../theme/CustomThemeProvider";
import { CustomStoreProvider } from "..//state/CustomStoreProvider";
import { AuthenticationProvider } from "../components/AuthenticationProvider";

export default function RootLayout(props: { children: any }) {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <CustomStoreProvider waitToLoad={true}>
          <CustomThemeProvider>
            <AuthenticationProvider>{children}</AuthenticationProvider>
          </CustomThemeProvider>
        </CustomStoreProvider>
      </body>
    </html>
  );
}

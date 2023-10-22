import CustomThemeProvider from "../theme/CustomThemeProvider";
import { CustomStoreProvider } from "..//state/CustomStoreProvider";

export default function RootLayout(props: { children: any }) {
  const { children } = props;
  return (
    <html lang="en">
      <body>
        <CustomStoreProvider>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </CustomStoreProvider>
      </body>
    </html>
  );
}

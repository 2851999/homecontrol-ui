"use client";
import { Provider } from "react-redux";
import { useStore } from "../state/store";
import CustomThemeProvider from "../theme/CustomThemeProvider";

export default function RootLayout(props: { children: any }) {
  const { children } = props;
  const store = useStore();
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

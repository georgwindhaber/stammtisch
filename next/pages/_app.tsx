import type { AppProps } from "next/app";
import { AppBar } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppBar>
      <Component {...pageProps} />
    </AppBar>
  );
}

export default MyApp;

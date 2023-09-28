import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { rqc } from "src/lib/react-query/client";

import { darkTheme } from "src/theme";
import { createEmotionCache } from "src/utils/next/createEmotionCache";
import { wrapper } from "src/store";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type MyAppProps = AppProps & {
  emotionCache: EmotionCache;
};

function MyApp(props: MyAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bifrost</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={rqc}>
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={darkTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

export default wrapper.withRedux(MyApp);

"use client";
import * as React from "react";
import { CssVarsProvider, getInitColorSchemeScript } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { theme } from "src/theme";
import NextAppDirEmotionCacheProvider from "./EmotionCache";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "joy" }}>
      {getInitColorSchemeScript()}
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </NextAppDirEmotionCacheProvider>
  );
}

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Theme = "light" | "dark" | "system";
type Attribute = "class" | "data-theme" | "data-mode";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: Attribute;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  themes?: string[];
  forcedTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensure we only render theme changes on the client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

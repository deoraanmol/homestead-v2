"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { AuthProvider } from "@/context/AuthProvider";

// 1. Create the Theme Context
const ThemeContext = createContext({
  themeColor: "#059669", // Default Homestead Green
  setThemeColor: (color: string) => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState("#059669");

  // 2. Inject the chosen color into global CSS variables dynamically
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-600", themeColor);
    
    // Auto-calculate variations for focus rings and subtle hover states
    document.documentElement.style.setProperty("--brand-500", `${themeColor}cc`); // 80% opacity
    document.documentElement.style.setProperty("--brand-700", `${themeColor}e6`); // 90% opacity
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

// 3. Export custom hook to use the picker anywhere
export const useTheme = () => useContext(ThemeContext);

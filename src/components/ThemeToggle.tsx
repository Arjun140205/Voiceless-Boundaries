"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 backdrop-blur-md bg-white/20 dark:bg-black/20 p-2 rounded-full border border-[#37ffd3]/20">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  );
}

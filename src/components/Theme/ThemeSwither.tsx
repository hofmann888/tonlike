'use client'

import { useTheme } from 'next-themes'
import { Switch } from "@heroui/switch";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      defaultSelected={theme === 'light'}
      color="primary"
      endContent={<FaMoon />}
      size="lg"
      startContent={<FaSun />}
      onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <span className="text-medium">
        Theme: <span className="capitalize text-primary">{theme}</span>
      </span>
    </Switch>
  )
}
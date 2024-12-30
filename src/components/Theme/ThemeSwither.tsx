'use client'

import { useTheme } from 'next-themes'
import { Switch } from "@nextui-org/switch";
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
      {`Theme: ${theme}`}
    </Switch>
  )
}
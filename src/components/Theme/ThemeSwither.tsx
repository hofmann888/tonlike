'use client'

import { useTheme } from 'next-themes'
import { Button } from "@nextui-org/button";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button color="primary" variant="shadow" size="md" onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </Button>
  )
}
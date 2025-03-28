'use client'

import { FaMoon, FaSun } from "react-icons/fa";
import { useTranslations } from 'next-intl';
import { Switch } from "@heroui/switch";
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('components.ThemeSwitcher');

  return (
    <Switch
      size="md"
      color="primary"
      endContent={<FaMoon />}
      startContent={<FaSun />}
      defaultSelected={theme === 'light'}
      onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <span className="text-medium">
        {t('theme')}: <span className="text-primary">
          {theme === 'light' ? t('light') : t('dark')}
        </span>
      </span>
    </Switch>
  )
}
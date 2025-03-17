'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useTranslations } from "next-intl";
import { useUser } from "@/hooks/useUser";
import { User } from "@heroui/user";
import LocaleSwitcher from "@/components/Settings/LocaleSwitcher";
import ThemeSwitcher from "@/components/Settings/ThemeSwither";

export default function HeaderUser() {
  const { tgUsername, tgFirstName, tgLastName, tgPhotoUrl } = useUser();
  const t = useTranslations('i18n');

  return (
    <div className="header-user">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: tgPhotoUrl,
              size: 'lg',
            }}
            classNames={{
              base: "transition-transform flex-row-reverse",
              wrapper: "items-end",
              name: "inline-block max-w-32 overflow-hidden text-ellipsis whitespace-nowrap text-large",
              description: "inline-block max-w-32 overflow-hidden text-ellipsis whitespace-nowrap text-medium"
            }}
            name={`${tgFirstName} ${tgLastName}`}
            description={!!tgUsername?.length && `@${tgUsername}`}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="blackList" color="primary" href="/black-list">
            <span className="text-medium">{t('blackList')}</span>
          </DropdownItem>
          <DropdownItem key="theme" closeOnSelect={false}>
            <ThemeSwitcher />
          </DropdownItem>
          <DropdownItem key="locale" closeOnSelect={false} isReadOnly>
            <LocaleSwitcher />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
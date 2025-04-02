'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { FaWallet, FaUsersSlash } from "react-icons/fa";
import { tgOpenLink } from "@/utils/helpers";
import { useTranslations } from "next-intl";
import { BiSupport } from "react-icons/bi";
import { useUser } from "@/hooks/useUser";
import { User } from "@heroui/user";
import LocaleSwitcher from "@/components/Settings/LocaleSwitcher";
import ThemeSwitcher from "@/components/Settings/ThemeSwither";

export default function HeaderUser() {
  const { tgUsername, tgFirstName, tgLastName, tgPhotoUrl } = useUser();
  const t = useTranslations('components.HeaderUser');

  const supportLink = `https://t.me/${process.env.NEXT_PUBLIC_TG_SUPPORT_BOT_NAME}`;

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
          <DropdownItem 
            key="wallet" 
            href="/wallet" 
            color="primary" 
            startContent={<FaWallet className="text-foreground-500 text-large" />}
          >
            <span className="text-medium">{t('wallet')}</span>
          </DropdownItem>
          <DropdownItem 
            key="blackList" 
            href="/black-list" 
            color="primary" 
            startContent={<FaUsersSlash className="text-foreground-500 text-large" />}
          >
            <span className="text-medium">{t('blackList')}</span>
          </DropdownItem>
          <DropdownItem 
            key="support" 
            color="primary" 
            startContent={<BiSupport className="text-foreground-500 text-large" />}
            onPress={() => tgOpenLink(supportLink)}
          >
            <span className="text-medium">{t('support')}</span>
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
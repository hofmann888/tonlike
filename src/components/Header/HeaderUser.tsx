'use client'

import { useUser } from "@/hooks/useUser";
import { User } from "@heroui/user";
import ThemeSwitcher from "@/components/Theme/ThemeSwither";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";

export default function HeaderUser() {
  const { tgUsername, tgFirstName, tgLastName, tgPhotoUrl } = useUser();

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
          <DropdownItem key="home" color="primary" href="/">
            Home
          </DropdownItem>
          <DropdownItem key="blackList" color="primary" href="/black-list">
            Black List
          </DropdownItem>
          <DropdownItem key="theme" closeOnSelect={false}>
            <ThemeSwitcher />
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
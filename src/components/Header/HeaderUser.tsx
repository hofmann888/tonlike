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
  const { tgUserName, tgFirstName, tgLastName, tgPhotoUrl } = useUser();

  return ( // TODO: check if user auth!
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
              wrapper: "items-end"
            }}
            description={<span className="text-medium">@{tgUserName}</span>}
            name={<span className="text-large">{tgFirstName} {tgLastName}</span>}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="theme" closeOnSelect={false}>
            <ThemeSwitcher />
          </DropdownItem>
          <DropdownItem key="blackList" color="primary" href="/black-list">
            Black List
          </DropdownItem>
          <DropdownItem key="home" color="primary" href="/">
            Home
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
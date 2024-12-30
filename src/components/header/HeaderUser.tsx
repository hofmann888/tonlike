'use client'

import { useUser } from "@/hooks/useUser";
import { User } from "@nextui-org/user";
import ThemeSwitcher from "@/components/Theme/ThemeSwither";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";

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
            className="transition-transform flex-row-reverse"
            description={<span className="text-medium">@{tgUserName}</span>}
            name={<span className="text-large">{tgFirstName} {tgLastName}</span>}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{`@${tgUserName}`}</p>
          </DropdownItem>
          <DropdownItem key="theme" closeOnSelect={false}>
            <ThemeSwitcher />
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
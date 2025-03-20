'use client'

import { FaTasks, FaTrophy, FaWallet, FaUserFriends } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";
import { NavLink } from "@/lib/definitions";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";

const navLinks: NavLink[] = [
  { href: '/leaderboard', title: "leaderboard", icon: FaTrophy },
  { href: '/earn', title: "earn", icon: FaSackDollar },
  { href: '/tasks', title: "tasks", icon: FaTasks },
  { href: '/referrals', title: "referrals", icon: FaUserFriends },
  { href: '/wallet', title: "wallet", icon: FaWallet },
]

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations('components.Footer');

  let selectedNav = pathname;
  if (pathname === '/tasks/create') {
    selectedNav = '/tasks';
  }

  return (
    <footer className="footer row-start-3 w-full h-[60px] sticky bottom-0 z-40 border-t-1 border-foreground-900 border-opacity-50 bg-background">
      <Tabs 
        selectedKey={selectedNav} 
        aria-label="Navigation"
        variant="underlined"
        color="primary"
        classNames={{ 
          base: "w-full h-full", 
          tabList: "w-full h-full relative rounded-none p-0 border-b border-divider gap-6 max-[480px]:gap-3 max-[410px]:gap-0",
          tab: "h-full w-1/5",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:text-foreground-900"
          // cursor: "w-full bg-[#22d3ee]",
        }}
      >
        {navLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Tab 
              as={Link}
              key={link.href} 
              href={link.href}
              title={
                <div className="flex flex-col items-center justify-center">
                  <LinkIcon className="w-6 h-6 mt-1" />
                  <span className="text-xs mt-1 max-[370px]:text-[0.65rem]">{t(`nav.${link.title}`)}</span>
                </div>
              }
            />
          );
        })}
      </Tabs>
    </footer>
  )
}
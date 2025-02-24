'use client'

import { FaCoins, FaTasks, FaTrophy, FaWallet, FaUserFriends } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { NavLink } from "@/lib/definitions";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";

const navLinks: NavLink[] = [
  { href: '/leaderboard', icon: FaTrophy },
  { href: '/earn', icon: FaCoins },
  { href: '/tasks', icon: FaTasks },
  { href: '/referrals', icon: FaUserFriends },
  { href: '/wallet', icon: FaWallet },
]

export default function Footer() {
  const pathname = usePathname();

  let selectedNav = pathname;
  if (pathname === '/tasks/create') {
    selectedNav = '/tasks';
  }

  return (
    <footer className="footer row-start-3 w-full h-[60px] sticky bottom-0 z-40 border-t-1 border-foreground-900 bg-background">
      <Tabs 
        selectedKey={selectedNav} 
        aria-label="Navigation"
        variant="underlined"
        color="primary"
        classNames={{ 
          base: "w-full h-full", 
          tabList: "w-full h-full relative rounded-none p-0 border-b border-divider gap-6 max-[355px]:gap-3",
          tab: "h-full",
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
                <LinkIcon className="w-7 h-7" />
              }
            />
          );
        })}
      </Tabs>
    </footer>
  )
}
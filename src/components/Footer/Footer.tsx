'use client'

import { FaTasks, FaTrophy, FaUserFriends } from "react-icons/fa";
import { FaSackDollar, FaShop } from "react-icons/fa6";
import { usePathname } from 'next/navigation';
import { useTranslations } from "next-intl";
import { NavLink } from "@/lib/definitions";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";

const navLinks: NavLink[] = [
  { key: 'leaderboard', href: '/leaderboard', t: "leaderboard", icon: FaTrophy },
  { key: 'earn', href: '/earn/tasks', t: "earn", icon: FaSackDollar },
  { key: 'tasks', href: '/tasks', t: "tasks", icon: FaTasks },
  { key: 'referrals', href: '/referrals', t: "referrals", icon: FaUserFriends },
  { key: 'shop', href: '/shop', t: "shop", icon: FaShop },
];

export function TabWrap({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="z-0 flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small rounded-none h-full w-1/5 p-0">
      {children}
    </div>
  )
}

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations('components.Footer');

  let selectedNav = pathname;
  if (pathname === '/tasks/create') {
    selectedNav = '/tasks';
  }
  if (pathname.includes('/earn/')) {
    selectedNav ='/earn/tasks';
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
          tab: "h-full w-1/5 p-0 ",
          cursor: "w-full",
          tabContent: "group-data-[selected=true]:text-foreground-900 w-full h-full"
          // cursor: "w-full bg-[#22d3ee]",
        }}
      >
        {navLinks.map((link) => {
          const LinkIcon = link.icon;
          const activeClass = selectedNav === link.href ? 'text-foreground-900' : '';
          return (
            <Tab 
              as={TabWrap}
              key={link.href}
              href={link.href}
              title={
                <Link href={link.href} prefetch={true} className={`w-full h-full flex flex-col items-center justify-center ${activeClass}`}>
                  <LinkIcon className="w-6 h-6 mt-1" />
                  <span className="text-xs mt-1 max-[370px]:text-[0.65rem]">{t(`nav.${link.t}`)}</span>
                </Link>
              }
            />
          );
        })}
      </Tabs>
    </footer>
  )
}
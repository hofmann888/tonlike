'use client'

import { FaCoins, FaTasks, FaTrophy, FaWallet } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import { NavLink } from "@/lib/definitions";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";
import "@/css/footer.scss";

const navLinks: NavLink[] = [
  { href: '/earn', icon: FaCoins },
  { href: '/tasks', icon: FaTasks },
  { href: '/leaderboard', icon: FaTrophy },
  { href: '/wallet', icon: FaWallet },
]

export default function Footer() {
  const pathname = usePathname();

  let selectedNav = pathname;
  if (pathname === '/tasks/create') {
    selectedNav = '/tasks';
  }

  // TODO replace Link with Tab.href after fixing HeroUIProvider
  return (
    <footer className="footer row-start-3">
      <nav className="footer-nav h-full">
        <Tabs 
          selectedKey={selectedNav} 
          aria-label="Navigation"
          variant="underlined"
          classNames={{ 
            base: "w-full h-full", 
            tabList: "gap-6 w-full h-full relative rounded-none p-0 border-b border-divider",
            tabContent: "w-full h-full",
            tab: "h-full p-0",
            cursor: "w-full bg-[#22d3ee]",
            // tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          }}
        >
          {navLinks.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Tab 
                key={link.href} 
                // href={link.href}
                title={
                  <Link href={link.href} className="flex items-center justify-center w-full h-full">
                    <LinkIcon className="w-7 h-7" />
                  </Link>  
                }
              />
            );
          })}
        </Tabs>
      </nav>
    </footer>
  )
}
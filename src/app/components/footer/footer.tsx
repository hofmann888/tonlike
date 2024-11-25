'use client'

import "../../css/footer.scss";
import { FaCoins, FaWallet, FaTasks } from "react-icons/fa";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavLink } from "@/app/lib/definitions";

const navLinks: NavLink[] = [
  { name: 'earn', href: '/earn', icon: FaCoins },
  { name: 'tasks', href: '/tasks', icon: FaTasks },
  { name: 'wallet', href: '/wallet', icon: FaWallet },
]

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="footer row-start-3">
      <nav className="footer-nav">
        {navLinks.map((link) => {
          const LinkIcon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'footer-nav-link',
                {
                  'active': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-7 h-7" />
            </Link>
          );
        })}
      </nav>
    </footer>
  )
}
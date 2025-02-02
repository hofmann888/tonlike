import HeaderBalance from "./HeaderBalance";
import HeaderUser from "./HeaderUser";

import "@/css/header.scss";

export default function Header() {
  return (
    <header className="header row-start-1">
      <HeaderBalance />

      <HeaderUser />
    </header>
  )
}
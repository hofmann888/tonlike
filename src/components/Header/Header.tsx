import HeaderBalance from "./HeaderBalance";
import HeaderUser from "./HeaderUser";
import "@/css/header.scss";

export default function Header() {
  return (
    <header className="flex justify-between items-center sticky top-0 z-40 bg-background border-b-1 border-foreground-900 border-opacity-50 row-start-1 px-2">
      <HeaderBalance />

      <HeaderUser />
    </header>
  )
}
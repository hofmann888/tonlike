import HeaderBalance from "./HeaderBalance";
import HeaderUser from "./HeaderUser";

export default function Header() {
  return (
    <header className="flex justify-between items-center sticky top-0 z-50 bg-background border-b-1 border-foreground-900 row-start-1 px-2">
      <HeaderBalance />

      <HeaderUser />
    </header>
  )
}
import HeaderWallet from "./HeaderWallet";
import HeaderBalance from "./HeaderBalance";
import "@/css/header.scss";

export default function Header() {
  return (
    <header className="header row-start-1">
      <HeaderBalance />

      <HeaderWallet />
    </header>
  )
}
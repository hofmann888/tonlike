import HeaderWallet from "./header-wallet";
import HeaderBalance from "./header-balance";
import "@/app/css/header.scss";


export default function Header() {
  return (
    <header className="header row-start-1">
      <HeaderBalance />

      <HeaderWallet />
    </header>
  )
}
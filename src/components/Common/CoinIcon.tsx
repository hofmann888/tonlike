import { Avatar } from "@heroui/avatar"

export default function CoinIcon({ 
  currency = 'coin', className
 }: { 
  currency?: 'coin' | 'usdt', className?: string 
}) {
  return (<Avatar className={`w-3 h-3 mx-1 ${className}`} src={`/img/currency/${currency}.png`} />)
}
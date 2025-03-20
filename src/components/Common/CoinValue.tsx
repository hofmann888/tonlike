import CoinIcon from "./CoinIcon"

// TODO?: contentBefore?: string | ReactNode?
export default function CoinValue({ 
  currency = 'coin', value, textBefore, className, classNames
}: { 
  currency?: 'coin' | 'usdt',
  value: number | bigint | string,
  textBefore?: string,
  className?: string,
  classNames?: { base?: string, avatar?: string }
}) {
  return (
    <span className={`inline-flex items-center ${className} ${classNames?.base}`}>
      {textBefore?.length && <span className="mr-1">{textBefore}</span>}
      <CoinIcon currency={currency} className={classNames?.avatar} />
      {value}
    </span>  
  )
}
import CoinIcon from "./CoinIcon"

// TODO?: contentBefore?: string | ReactNode?
// TODO?: classNames slots?
export default function CoinValue({ 
  value, textBefore, className 
}: { 
  value: number | bigint | string,
  textBefore?: string,
  className?: string 
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {textBefore?.length && <span className="mr-1">{textBefore}</span>}
      <CoinIcon /> 
      {value}
    </span>  
  )
}
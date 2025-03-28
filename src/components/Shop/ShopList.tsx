import ShopCard from "./ShopCard";

const items = [
  { label: '1000 $LIKE', amount: 1000, price: 10, discount: 0 },
  { label: '5000 $LIKE', amount: 5000, price: 50, discount: 0 },
  { label: '10000 $LIKE', amount: 10000, price: 98, discount: 2 },
  { label: '25000 $LIKE', amount: 25000, price: 240, discount: 4 },
  { label: '50000 $LIKE', amount: 50000, price: 460, discount: 8 },
  { label: '100000 $LIKE', amount: 100000, price: 900, discount: 10 },
]

export default function ShopList() {
  return (
    <div className="gap-5 grid grid-cols-2">
      {items.map((item, idx) => <ShopCard key={idx} item={item} />)}
    </div>
  )
}
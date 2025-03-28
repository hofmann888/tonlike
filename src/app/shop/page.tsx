import ShopList from "@/components/Shop/ShopList"

export default function ShopPage() {
  return (
    <div className="flex flex-col justify-between h-full pt-4 px-2 max-w-[500px] max-[500px]:max-w-[100vw]">
      <ShopList />
    </div>
  )
}
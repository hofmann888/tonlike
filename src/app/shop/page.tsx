import { getAuthUser } from "@/core/session";
import { fetchProducts } from "@/db/query";
import PageLoader from "@/components/Common/PageLoader";
import ProductList from "@/components/Shop/ProductList"
import "@/css/shop.scss";

export const revalidate = 3600;

export default async function ShopPage() {
  const user = await getAuthUser();
  if (!user) return (<PageLoader />);

  const products = await fetchProducts(true);

  return (
    <div className="flex flex-col justify-between h-full pt-4 px-2 max-w-[500px] max-[500px]:max-w-[100vw]">
      <ProductList products={products} />
    </div>
  )
}
import { Product } from "@/lib/definitions";
import ProductCard from "./ProductCard";

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="gap-5 grid grid-cols-2">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
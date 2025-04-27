'use client'

import { Card, CardBody, CardFooter } from "@heroui/card";
import { addToast, ToastProps } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { createInvoiceLinkByProduct } from "@/utils/tg-api";
import { calculateFinalPrice } from "@/utils/helpers";
import { invoice } from "@telegram-apps/sdk-react";
import { refreshSession } from "@/core/session";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/definitions";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import { useState } from "react";
import CoinValue from "@/components/Common/CoinValue";


export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('components.ProductCard');
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const finalPrice = calculateFinalPrice(product.price, product.discount);
  
  async function openInvoice() {
    setLoading(true);
    const invoiceLink = await createInvoiceLinkByProduct(product);
    invoice
      .open(invoiceLink, 'url')
      .then(async (status: any) => {
        if (status === 'paid') {
          const toast = {
            color: "success",
            title: t('success'),
            description: `${t('purchased')} ${product.title}`,
          };
          addToast(toast as ToastProps);

          await refreshSession();
          router.refresh();
        }
      });
    setLoading(false);
  }

  return (
    <Card 
      shadow="sm"
      className="product-card border-none bg-background/60 dark:bg-default-100/50 mb-3"
      isBlurred
      isPressable
      onPress={openInvoice}
    >
      <CardBody className="p-0 relative overflow-hidden">
        <Image
          alt={product.title}
          shadow="sm"
          radius="none"
          src={product.imgUrl}
          className="object-cover px-8 py-2"
          width="100%"
          isBlurred
          removeWrapper
        />

        <div className="flex justify-center items-end w-full h-full text-center">
          <CoinValue 
            value={product.amount} 
            classNames={{ 
              base: "coin-value text-3xl text-white justify-center font-bold w-full py-3 bg-white/5 max-[400px]:text-2xl",
              avatar: "w-8 h-8" 
            }} 
          />
        </div>
      </CardBody>

      <CardFooter className="justify-center max-[360px]:px-2">
        {loading 
          ? <Spinner />
          :
            <>
              <span className="max-[330px]:text-[18px]">⭐ {finalPrice}</span>
              {product.discount > 0 &&
                <Chip color="danger" variant="flat" className="ml-1">-{product.discount}%</Chip>
              }
            </>
        }
      </CardFooter>
    </Card>
  )
}
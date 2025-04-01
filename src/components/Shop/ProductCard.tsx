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
        <div className="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 text-center">
          {loading 
            ? <Spinner />
            :
              <CoinValue 
                value={product.amount} 
                classNames={{ 
                  base: "coin-value text-3xl text-white justify-center font-bold w-full h-16 rounded-lg bg-black/30 max-[360px]:text-2xl",
                  avatar: "w-8 h-8" 
                }} 
              />
          }
        </div>

        <Image
          alt={product.title}
          shadow="sm"
          radius="lg"
          src="/img/logo.png"
          className="object-cover blur-[10px]"
          width="100%"
          height="150px"
          isBlurred
        />
      </CardBody>

      <CardFooter className="justify-center max-[360px]:px-2">
        <span className="">⭐ {finalPrice}</span>
        {product.discount > 0 &&
          <Chip color="danger" variant="flat" className="ml-1">-{product.discount}%</Chip>
        }
      </CardFooter>
    </Card>
  )
}
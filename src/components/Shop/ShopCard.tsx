'use client'

import { Card, CardBody, CardFooter } from "@heroui/card";
import { createInvoiceLink } from "@/utils/tg-api";
import { invoice } from "@telegram-apps/sdk-react";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip";
import CoinValue from "@/components/Common/CoinValue";


export default function ShopCard({ item }: { item: any }) {
  async function openInvoice() {
    const invoiceLink = await createInvoiceLink(item.label, item.amount);
    console.log('invoiceLink', invoiceLink);
    invoice
      .open(invoiceLink, 'url')
      .then((status: any) => {
        return console.log('openInvoice status:', status);
      })
  }

  return (
    <Card 
      shadow="sm"
      className="shop-card border-none bg-background/60 dark:bg-default-100/50 mb-3"
      isBlurred
      isPressable
      onPress={openInvoice}
    >
      <CardBody className="p-0 relative overflow-hidden">
        <div className="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 text-center">
          <CoinValue 
            value={item.amount} 
            classNames={{ 
              base: "coin-value text-3xl justify-center font-bold w-full h-16 rounded-lg bg-black/30 max-[360px]:text-2xl",
              avatar: "w-8 h-8" 
            }} 
          />
        </div>

        <Image
          alt={item.label}
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
        <span className="">⭐ {item.price}</span>
        {item.discount > 0 &&
          <Chip color="danger" variant="flat" className="ml-1">-{item.discount}%</Chip>
        }
      </CardFooter>
    </Card>
  )
}
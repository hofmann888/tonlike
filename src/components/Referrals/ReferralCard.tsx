import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/user";
import { Referral } from "@/lib/definitions";
import CoinValue from "../Common/CoinValue";

export default function ReferralCard({ referral }: { referral: Referral }) {
  const profit = Math.round(referral.profit / 10) + 1000;
  const date = new Date(referral.createdAt);

  return (
    <Card 
      key={referral.id} 
      className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
      shadow="sm"
      isBlurred
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center w-3/4 max-[350px]:w-2/3">
          <div className="text-tiny w-20">
            <p>{date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
            <p>{date.toLocaleTimeString('ru-RU')}</p>
          </div>

          <User
            avatarProps={{
              isBordered: true,
              src: referral.tgPhotoUrl as string,
              size: 'sm',
              className: "min-w-8 min-h-8"
            }}
            classNames={{ 
              base: "w-[60%] justify-start",
              wrapper: "w-[70%]",
              name: "w-full max-w-full inline-block overflow-hidden text-ellipsis whitespace-nowrap"
            }}
            name={!!referral.tgUsername?.length ? `@${referral.tgUsername}` : referral.tgId}
          />
        </div>
        
        <div className="w-[80px] text-right text-small text-primary-500"> 
          <CoinValue value={profit} />
        </div>
      </CardBody>
    </Card>
  )
}
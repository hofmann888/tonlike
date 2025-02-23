import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/user";
import { Referral } from "@/lib/definitions";
import CoinValue from "../Common/CoinValue";

export default function ReferralCard({ referral }: { referral: Referral }) {
  const profit = Math.round(referral.profit / 10) + 1000;
  const date = new Date(referral.createdAt); // TODO: some shit with toLocaleDateString (use ru-RU everywhere? or get from language)

  return (
    <Card 
      key={referral.id} 
      className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
      shadow="sm"
      isBlurred
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex">
          <div className="text-tiny mr-8">
            <p>{date.toLocaleDateString()}</p>
            <p>{date.toLocaleTimeString()}</p>
          </div>

          <User
            avatarProps={{
              isBordered: true,
              src: referral.tgPhotoUrl,
              size: 'sm',
            }}
            name={!!referral.tgUsername?.length ? `@${referral.tgUsername}` : '???'}
          />
        </div>

        <CoinValue value={profit} className="text-medium text-primary-500" />
      </CardBody>
    </Card>
  )
}
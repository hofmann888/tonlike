import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody } from "@heroui/card";
import { User as UserUI } from "@heroui/user";
import { User } from "@/lib/definitions";
import CoinValue from "../Common/CoinValue";

export default function ReferralsList({ referrals }: { referrals: User[] }) {
  return (
    <ScrollShadow className="max-h-80 mb-8">
      {referrals.length 
        ? referrals.map((referral) => (
          <Card 
            key={referral.id} 
            className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
            shadow="sm"
            isBlurred
          >
            <CardBody className="flex-row justify-between items-center">
              <UserUI
                avatarProps={{
                  isBordered: true,
                  src: referral.tg_photo_url,
                  size: 'sm',
                }}
                name={`@${referral.tg_username}`}
              />

              <CoinValue value={888} className="text-medium" />
            </CardBody>
          </Card>
        )) : <p>You haven't invited any friends yet</p>
      }
    </ScrollShadow> 
  )
}
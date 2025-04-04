import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";
import { LeaderboardItem } from "@/lib/definitions";
import CoinValue from "@/components/Common/CoinValue";

export default function LeaderboardCard({ item }: { item: LeaderboardItem }) {
  return (
    <Card  isBlurred className="border-none bg-background/60 dark:bg-default-100/50 mt-1">
      <CardBody className="flex flex-row justify-between items-center py-2">
        <div className="flex items-center w-3/4 max-[350px]:w-2/3">
          <span className="text-small inline-block w-[42px] min-w-[42px] text-center mr-4">
            {item.position === 1 && <span className="text-xl">🥇</span>}
            {item.position === 2 && <span className="text-xl">🥈</span>}
            {item.position === 3 && <span className="text-xl">🥉</span>} 
            {item.position > 3 && `#${item.position}`}
          </span>
          
          <User
            avatarProps={{
              isBordered: true,
              src: item.tgPhotoUrl as string,
              size: 'sm',
            }}
            classNames={{ 
              base: "w-[80%] justify-start",
              wrapper: "w-[70%]",
              name: "w-full flex"
            }}
            name={
              <span className="max-w-full inline-block overflow-hidden text-ellipsis whitespace-nowrap">
                {!!item.tgUsername?.length ? `@${item.tgUsername}` : item.tgId } 
              </span>
            }
          />
        </div>

        <div className="w-1/4 max-[350px]:w-1/3 text-right text-small text-primary-500"> 
          <CoinValue value={item.balance} />
        </div>
      </CardBody>
    </Card>
  )
}
import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";
import { LeaderboardItem } from "@/lib/definitions";
import CoinValue from "@/components/Common/CoinValue";

export default function LeaderboardCard({ item }: { item: LeaderboardItem }) {
  return (
    <Card  isBlurred className="border-none bg-background/60 dark:bg-default-100/50 mt-1">
      <CardBody className="flex flex-row justify-between items-center py-2">
        <div className="flex items-center">
          <span className="text-small inline-block w-[20px] text-center mr-4">
            {item.position === 1 && <span className="text-xl">🥇</span>}
            {item.position === 2 && <span className="text-xl">🥈</span>}
            {item.position === 3 && <span className="text-xl">🥉</span>} 
            {item.position > 3 && `#${item.position}`}
          </span>
          
          <User
            avatarProps={{
              isBordered: true,
              src: item.tgPhotoUrl,
              size: 'sm',
            }}
            className="justify-start"
            name={!!item.tgUsername?.length ? `@${item.tgUsername}` : '???'}
            // description={<CoinValue value={user.balance} className="text-tiny text-primary-500" />}
          />
        </div>

        {/* <span
          className={clsx(
            'text-small',
            {
              'text-yellow-500': idx + 1 === 1,
              'text-gray-500': idx + 1 === 2,
              'text-yellow-800': idx + 1 === 3,
            },
          )}
        >
          {idx === 0 && <span className="text-xl">🥇</span>}
          {idx === 1 && <span className="text-xl">🥈</span>}
          {idx === 2 && <span className="text-xl">🥉</span>} 
          {idx > 2 && `#${idx + 1}`}
        </span> */}

        <div className="w-1/6 text-right text-small text-primary-500"> <CoinValue value={item.balance} /></div>
      </CardBody>
    </Card>
  )
}
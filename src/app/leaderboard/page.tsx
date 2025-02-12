'use server'

import { User } from "@heroui/user";
import { Card, CardBody } from "@heroui/card";
import { fetchUsersLeaderboard } from "@/db/query";
import CoinValue from "@/components/Common/CoinValue";
import clsx from 'clsx';

export default async function LeaderboardPage() {
  const users = await fetchUsersLeaderboard();

  return (
    <div className="py-5 px-2">
      {users.map((user, idx) => (
        <Card key={idx} isBlurred className="border-none bg-background/60 dark:bg-default-100/50 mt-1">
          <CardBody className="flex flex-row justify-between items-center">
            <span
              className={clsx(
                'w-2/6 text-medium',
                {
                  'text-yellow-500': idx + 1 === 1,
                  'text-gray-500': idx + 1 === 2,
                  'text-yellow-800': idx + 1 === 3,
                },
              )}
            >#{idx + 1}</span>
            
            <User
              avatarProps={{
                isBordered: true,
                src: user.tgPhotoUrl,
                size: 'sm',
              }}
              className="w-3/6 justify-start"
              name={`@${user.tgUsername}`}
            />

            <div className="w-1/6 text-right text-medium"> <CoinValue value={user.balance} /></div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
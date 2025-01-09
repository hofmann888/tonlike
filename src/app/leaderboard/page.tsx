'use server'

import { fetchUsersLeaderboard } from "@/db/sql";
import { Card, CardBody } from "@nextui-org/card";
import { User } from "@nextui-org/user";
import clsx from 'clsx';

export default async function LeaderboardPage() {
  const users = await fetchUsersLeaderboard();

  return (
    <div className="py-5">
      {users.map((user, idx) => (
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50">
          <CardBody className="flex flex-row justify-between ">
            <span
              className={clsx(
                'w-2/6',
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
                src: user.tg_photo_url,
                size: 'sm',
              }}
              className="w-3/6 justify-start"
              name={`@${user.tg_username}`}
            />

            <span className="w-1/6 text-right">{user.reward}</span>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
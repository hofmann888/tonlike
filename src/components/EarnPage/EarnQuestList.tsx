import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import CoinValue from "../Common/CoinValue";

import { MdTaskAlt } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import { BiTask } from "react-icons/bi";
import { LuUserPlus } from "react-icons/lu";
import { GoGoal } from "react-icons/go";

export default function EarnQuestList() {
  return (
    <div>
        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-b from-pink-500 to-blue-500",
                  icon: "text-2xl"
                }}
                icon={<MdTaskAlt />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Check-in</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row items-center">
            <div className="flex items-center gap-2 w-1/2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-b from-cyan-500 to-blue-500",
                  icon: "text-2xl"
                }}
                icon={<RiAdvertisementFill />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Watch Ad</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>


            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                  icon: "text-2xl"
                }}
                icon={<BiTask />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Complete a task</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>
          
        <br />


        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                className="flex-shrink-0"
                size="sm"
                src='/img/social/telegram.png'
              />
              <div className="flex flex-col">
                <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  <span className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">@tonfollow</span>
                </Link>
                <span className="text-small text-foreground-400">Subscribe</span>
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-b from-pink-500 to-blue-500 w-8 h-8",
                  icon: "text-xl"
                }}
                icon={<LuUserPlus />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Invite 5 friends</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-b from-pink-500 to-blue-500",
                  icon: "text-2xl"
                }}
                icon={<BiTask />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Complete 5 tasks</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                // size="sm"
                classNames={{
                  base: "bg-gradient-to-b from-pink-500 to-blue-500",
                  icon: "text-2xl"
                }}
                icon={<GoGoal />}
              />
              <div className="flex flex-col">
                {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  link???
                </Link> */}
                <span className="text-medium">Complete 5 quests</span>
                {/* <span className="text-small text-foreground-400">Daily check-in</span> */}
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar
                // alt={task.service.name}
                alt='123'
                className="flex-shrink-0 w-10 h-10"
                size="sm"
                src='/img/social/x.png'
              />
              <div className="flex flex-col">
                <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                  <span className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">@partner</span>
                </Link>
                <span className="text-small text-foreground-400">Subscribe</span>
              </div>
            </div>

            <div className="flex justify-between w-1/2">
              <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={888} /></div>

              <div className="flex items-center">
                <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
              </div>
            </div>
          </CardBody>
        </Card>
    </div>
  )
}
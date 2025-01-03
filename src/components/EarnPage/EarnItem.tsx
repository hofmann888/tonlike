import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Task } from "@/lib/definitions";
// import { MdArrowForwardIos } from "react-icons/md";


export default function EarnItem({task}: {task: Task}) {
  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            alt={task.service.name}
            className="flex-shrink-0"
            size="sm"
            src={task.service.img}
          />
          <div className="flex flex-col">
            <Link isExternal showAnchorIcon href={task.link}>
              {task.link}
            </Link>
            <span className="text-small text-foreground-400">{task.action.name}</span>
          </div>
        </div>

        <div>
          <p className="text-medium text-green-600">+ ${task.price}</p>
          <p className="text-medium text-yellow-600">+ {task.action.reward}</p>
        </div>

        <Button color="primary" variant="bordered" className="btn-border-shadow">Start</Button>
        {/* <MdArrowForwardIos /> */}
      </CardBody>
    </Card>
  )
}
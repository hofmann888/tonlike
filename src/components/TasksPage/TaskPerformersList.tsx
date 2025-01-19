import { Card, CardBody } from "@heroui/card";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Performer } from "@/lib/definitions";

export default function TaskPerformersList({ performers }: { performers: Performer[] }) {
  // console.log('TaskPerformersList:', performers);
  // for (let i = 0; i < 20; i++) {
  //   performers.push(performers[1]);
  // }
  return (
    <ScrollShadow className="w-full mt-2 pt-2 max-h-44 overflow-auto">
      {performers.map((performer) => {
        const date = new Date(performer.created_at);

        return (
        <Card key={performer.id} className="mt-1">
          <CardBody className="flex-row justify-between items-center">
            <div className="text-tiny">
              <p>{date.toLocaleDateString()}</p>
              <p>{date.toLocaleTimeString()}</p>
            </div>

            <User
              avatarProps={{
                isBordered: true,
                src: performer.tg_photo_url,
                size: 'sm',
              }}
              className="w-3/6 justify-start"
              name={`@${performer.tg_username}`}
            />

            <Button color="danger" variant="flat">Block</Button>
          </CardBody>
        </Card>
      )})}
    </ScrollShadow>
  )
}
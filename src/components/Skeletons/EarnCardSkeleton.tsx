import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

export default function EarnCardSkeleton() {
  return (
    <Card 
      radius="lg" 
      className="p-3 flex flex-row justify-between items-center border-none bg-background/60 dark:bg-default-100/50 mb-2" 
    >
      <div className="flex w-1/2 items-center gap-3">
        <div>
          <Skeleton className="flex w-11 h-11 rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-3/5 rounded-lg" />
        </div>
      </div>

      <div className="flex items-center">
        {/* <Skeleton className="h-5 w-8 mr-5 rounded-lg" /> */}
        <Skeleton className="h-10 w-20 mr-12 rounded-xl" />
        {/* <Skeleton className="h-5 w-8 rounded-lg" /> */}
      </div>
    </Card>
  )
}
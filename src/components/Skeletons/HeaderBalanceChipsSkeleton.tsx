import { Skeleton } from "@heroui/skeleton";

export default function HeaderBalanceChipsSkeleton() {
  return (
    <div className="flex flex-row justify-start text-medium mt-1">
      <Skeleton className="h-6 w-12 mr-1 rounded-xl" />
      <Skeleton className="h-6 w-12 rounded-xl" />
    </div>
  )
}
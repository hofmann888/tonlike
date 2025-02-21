import EarnCardSkeleton from "./EarnCardSkeleton"

export default function EarnCardListSkeleton() {
  return (
    <>
      {[...Array(5)].map((i) =>
        <EarnCardSkeleton />
      )}
    </>
  )
}
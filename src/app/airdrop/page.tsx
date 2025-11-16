import AirdropClaim from '@/components/Airdrop/AirdropClaim';

export const revalidate = 86400;

export default function AirdropPage() {
  return (
    <div className="py-5 px-2 h-full max-w-[500px] max-[500px]:max-w-[100vw]">
      <AirdropClaim />
    </div>
  )
}
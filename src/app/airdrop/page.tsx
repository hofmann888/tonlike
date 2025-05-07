import AirdropBanner from '@/components/Airdrop/AirdropBanner';

export const revalidate = 86400;

export default function AirdropPage() {
  return (
    <div className="py-5 px-2 h-full max-w-[500px] max-[500px]:max-w-[100vw]">
      <AirdropBanner />
    </div>
  )
}
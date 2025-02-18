import { ScrollShadow } from "@heroui/scroll-shadow";
import { Referral } from "@/lib/definitions";
import ReferralCard from "./ReferralCard";

export default function ReferralsList({ referrals }: { referrals: Referral[] }) {
  return (
    <ScrollShadow className="max-h-80 mb-8">
      {referrals.length 
        ? referrals.map((referral) => (
          <ReferralCard referral={referral} />
        )) : <p>You haven&#39;t invited any friends yet</p>
      }
    </ScrollShadow> 
  )
}
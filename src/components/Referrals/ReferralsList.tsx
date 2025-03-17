import { ScrollShadow } from "@heroui/scroll-shadow";
import { Referral } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import ReferralCard from "./ReferralCard";

export default function ReferralsList({ referrals }: { referrals: Referral[] }) {
  const t = useTranslations('i18n');

  return (
    <ScrollShadow className="max-h-80 mb-8">
      {referrals.length 
        ? referrals.map((referral) => (
          <ReferralCard key={referral.id} referral={referral} />
        )) : <p className="text-center text-medium">{t('friendsListEmpty')}</p>
      }
    </ScrollShadow> 
  )
}
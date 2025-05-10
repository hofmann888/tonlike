'use client'

import { ScrollShadow } from "@heroui/scroll-shadow";
import { useRef, useEffect, useState } from "react";
import { fetchUserReferrals } from "@/db/query";
import { Referral } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";
import { useUser } from "@/hooks/useUser";
import ReferralCard from "./ReferralCard";

export default function ReferralsList({ referrals }: { referrals: Referral[] }) {
  const t = useTranslations('components.ReferralsList');
  const scrollRef: any = useRef(null);
  const { id } = useUser();

  const [referralsFiltered, setReferralsFiltered] = useState(referrals);
  const [autoload, setAutoload] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [offset, setOffset] = useState(10);
  const pageItemsSize = 10;

  useEffect(() => {
    autoload && scrollRef.current?.addEventListener("scroll", scrollEvent);
    return () => scrollRef.current?.removeEventListener("scroll", scrollEvent);
  }, [autoload, loading, page])

  async function scrollEvent() {
    const el = scrollRef.current;
    const sc = el.scrollHeight - el.clientHeight - el.scrollTop;

    if (sc < 1) {
      await autoloadReferrals();
    }
  }

  async function autoloadReferrals() {
    if (autoload && !loading) {
      setLoading(true);

      const items = await fetchUserReferrals(id, { limit: pageItemsSize, offset: offset });
      let referralsUpdated = referralsFiltered.concat(items);
      setReferralsFiltered(referralsUpdated);
  
      setOffset((page + 1) * pageItemsSize);
      setPage(page + 1);
      items.length < pageItemsSize && setAutoload(false);

      setLoading(false);
    }
  }

  return (
    <ScrollShadow ref={scrollRef} className="max-h-80 mb-8">
      {referralsFiltered.length 
        ? referralsFiltered.map((referral) => (
          <ReferralCard key={referral.id} referral={referral} />
        )) : <p className="text-center text-medium">{t('empty')}</p>
      }

      {loading && <div className="flex justify-center w-full py-2"><Spinner /></div>}
    </ScrollShadow> 
  )
}
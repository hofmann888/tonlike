'use server'

import { fetchUserReferrals, fetchUserReferralsTaskEarningsSum } from "@/db/query";
import { getAuthUser } from "../auth/session";
import { User } from "@/lib/definitions";
import ReferralsButtons from "@/components/Referrals/ReferralsButtons";
import ReferralsList from "@/components/Referrals/ReferralsList";
import ReferralsInfo from "@/components/Referrals/ReferralsInfo";
import PageLoader from "@/components/Common/PageLoader";

export default async function RefferalsPage() {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const [referrals, sum, sumToday] = await Promise.all([
    fetchUserReferrals(user.id),
    fetchUserReferralsTaskEarningsSum(user.id),
    fetchUserReferralsTaskEarningsSum(user.id, true),
  ]);

  const todayDateStr = new Date().toISOString().split('T')[0];
  const referralsToday = referrals.filter((referral) => referral.createdAt?.toISOString().split('T')[0] === todayDateStr);
  const profit = Math.round(referrals.length * 1000 + sum / 10); // TODO!?: vashe fixit nado refferals sum (a esli price will change...)
  const profitToday = Math.round(referralsToday.length * 1000 + sumToday / 10);

  // for (let i = 0; i < 20; i++) {
  //   userRefs.push(userRefs[0]);
  // }

  return (
    <div className="flex flex-col justify-between h-full pt-4 px-2">
      <div>
        <ReferralsInfo count={referrals.length} profit={profit} profitToday={profitToday} claimedSum={user.claimed} />

        <ReferralsList referrals={referrals} />
      </div>

      <ReferralsButtons />
    </div>
  )
}
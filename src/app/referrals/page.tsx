'use server'

import { getAuthUser } from "../auth/session";
import { fetchUserRefs } from "@/db/sql";
import { User } from "@/lib/definitions";
import ReferralsList from "@/components/ReferralsPage/ReferralsList";
import ReferralsInfo from "@/components/ReferralsPage/ReferralsInfo";
import ReferralsButtons from "@/components/ReferralsPage/ReferralsButtons";

export default async function RefferalsPage() {
  const user: User = await getAuthUser(false);
  const referrals: User[] = await fetchUserRefs(user.id);

  // for (let i = 0; i < 20; i++) {
  //   userRefs.push(userRefs[0]);
  // }

  return (
    <div className="flex flex-col justify-between h-full pt-4">
      <div>
        <ReferralsInfo count={referrals.length} profit={888} profitToday={8} />

        <ReferralsList referrals={referrals} />
      </div>

      <ReferralsButtons bot={process.env.TG_BOT_NAME as string} app={process.env.TG_APP_NAME as string} />
    </div>
  )
}
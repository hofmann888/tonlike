'use client'

import { Card, CardHeader, CardBody } from "@heroui/card";
import { ClaimReferralEarnings } from "@/core/actions";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { useState } from "react";
import CoinValue from "../Common/CoinValue";

export default function ReferralsInfo({ 
  count, profit, profitToday, claimedSum 
}: { 
  count: number, profit: number, profitToday: number, claimedSum: number
}) {
  const t = useTranslations('i18n');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const claimSum = profit - claimedSum;

  async function claim() {
    setLoading(true);
    !!error.length && setError('');

    const result = await ClaimReferralEarnings();
    if (result?.message.length) {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <Card className="mr-2 border-1 border-foreground-300 bg-[#00001280] w-3/4 max-[400px]:w-2/3">
          <CardHeader className="text-medium text-primary pb-0">{t('inviteFriends')}</CardHeader>
          <CardBody className="text-small text-foreground-500">
            <p>{t('inviteFriendsMsg1')}</p>
            <p>{t('inviteFriendsMsg2')}</p>
          </CardBody>
        </Card>

        <Card className="ml-2 border-1 border-foreground-300 bg-[#00001280] w-1/4 max-[400px]:w-1/3">
          <CardHeader className="text-medium text-primary pb-0">{t('friends')}</CardHeader>
          <CardBody className="text-center text-3xl">{count}</CardBody>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
        <Card className="w-1/2 mr-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">{t('profitToday')}</CardHeader>
          <CardBody>
            <CoinValue value={profitToday} />
          </CardBody>
        </Card>

        <Card className="w-1/2 ml-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">{t('profit')}</CardHeader>
          <CardBody className="flex flex-row justify-between">
            <CoinValue value={profit} />
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-row justify-center items-center mt-8">
          <Button 
            color="primary" 
            className="mr-3 gap-1" 
            isLoading={loading} 
            isDisabled={!claimSum}
            onPress={claim}
          >
            {t('claim')} <CoinValue value={claimSum} className="text-small" />
          </Button>
          <p className="flex text-small">
            {t('claimed')}: <CoinValue value={claimedSum} className="text-small ml-1" />
          </p>
      </div>

      {!!error.length &&
        <p className="mt-2 text-sm text-danger text-center" key={error}>
          {error}
        </p>
      }
    </div>
  )
}
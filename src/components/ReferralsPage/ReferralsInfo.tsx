'use client'

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useState } from "react";
import { claimReferralEarnings } from "@/core/actions";
import CoinValue from "../Common/CoinValue";

export default function ReferralsInfo({ 
  count, profit, profitToday, claimedSum 
}: { 
  count: number, profit: number, profitToday: number, claimedSum: number
}) {
  const claimSum = profit - claimedSum;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function claim() {
    setLoading(true);
    !!error.length && setError('');

    const result = await claimReferralEarnings();
    if (result?.message.length) {
      setError(result.message);
    }

    setLoading(false);
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <Card className="w-3/4 mr-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">Invate Friends</CardHeader>
          <CardBody className="text-small text-foreground-500">
            <p>Earn from they profit!</p>
            <p>1000 coins for a friend + 10% from their earnings</p>
          </CardBody>
        </Card>

        <Card className="w-1/4 ml-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">Friends</CardHeader>
          <CardBody className="text-center text-3xl">{count}</CardBody>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
        <Card className="w-1/2 mr-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">Profit today</CardHeader>
          <CardBody>
            <CoinValue value={profitToday} />
          </CardBody>
        </Card>

        <Card className="w-1/2 ml-2 border-1 border-foreground-300 bg-[#00001280]">
          <CardHeader className="text-medium text-primary pb-0">Profit</CardHeader>
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
            Claim <CoinValue value={claimSum} className="text-small" />
          </Button>
          <p className="flex text-small">
            Claimed: <CoinValue value={claimedSum} className="text-small ml-1" />
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
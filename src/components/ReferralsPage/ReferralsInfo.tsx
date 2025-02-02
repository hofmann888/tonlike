import { Card, CardHeader, CardBody } from "@heroui/card";
import CoinValue from "../Common/CoinValue";

export default function ReferralsInfo({ 
  count, profit, profitToday 
}: { 
  count: number, profit: number, profitToday: number 
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <Card className="w-3/4 mr-2">
          <CardHeader>Invate Friends</CardHeader>
          <CardBody className="text-medium text-foreground-500">
            <p>Earn from they profit!</p>
            <p>10 coins for a friend + 10% from their earnings</p>
          </CardBody>
        </Card>

        <Card className="w-1/4 ml-2">
          <CardHeader>Friends</CardHeader>
          <CardBody className="text-center text-4xl">{count}</CardBody>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
      <Card className="w-1/2 mr-2">
          <CardHeader>Profit today</CardHeader>
          <CardBody>
            <CoinValue value={profitToday} />
          </CardBody>
        </Card>

        <Card className="w-1/2 ml-2">
          <CardHeader>Profit</CardHeader>
          <CardBody>
            <CoinValue value={profit} />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
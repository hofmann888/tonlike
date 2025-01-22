import { Card, CardHeader, CardBody } from "@heroui/card";
import { PiCoinVertical } from "react-icons/pi";

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
            <div className="flex items-center"><PiCoinVertical /> {profitToday}</div>
          </CardBody>
        </Card>

        <Card className="w-1/2 ml-2">
          <CardHeader>Profit</CardHeader>
          <CardBody>
            <div className="flex items-center"><PiCoinVertical /> {profit}</div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
'use client'

import { clearHideEarnWaningCookie } from "@/core/actions";
import { deleteSession } from "@/core/session";
import { AppEnvEnum } from "@/lib/definitions";
import { Button } from "@heroui/button";
import PageLoader from "@/components/Common/PageLoader";

export default function Home() {
  if (process.env.NEXT_PUBLIC_APP_ENV === AppEnvEnum.PROD) return <PageLoader />;

  const test = async () => {
    console.log('test');
    await clearHideEarnWaningCookie();
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">Test</Button>

      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>
    </div>
  );
}

'use client'

import { tgCheckMembershipRequest, tgCheckBoostRequest } from "@/utils/requests";
import { deleteSession } from "./auth/session";
import { tgOpenLink } from "@/utils/helpers";
import { Button } from "@heroui/button";


export default function Home() {
  const test = async () => {
    // await tgCheckMembershipRequest(6681557705, '@test_channel_chat00800');
    // await tgCheckBoostRequest(5229340312, '@tonlike_app');
    tgOpenLink('https://t.me/deadgens');
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">Test</Button>

      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>
    </div>
  );
}

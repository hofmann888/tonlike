'use client'

import { tgCheckMembershipRequest, tgSetWebhookRequest } from "@/utils/requests";
import { deleteSession } from "./auth/session";
import { Button } from "@heroui/button";
import "@/css/main.scss";

export default function Home() {
  const test = async () => {
    await tgCheckMembershipRequest(6681557705, '@test_channel_chat00800');
  }

  const setWebhook = async () => {
    await tgSetWebhookRequest();
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">test</Button>

      <Button color="primary" onPress={() => setWebhook()} className="m-2">setWebhook</Button>

      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>
    </div>
  );
}

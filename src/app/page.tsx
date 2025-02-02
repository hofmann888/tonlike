'use client'

import { tgCheckMembershipRequest } from "@/utils/requests";
import { Button } from "@heroui/button";
import "@/css/main.scss";

export default function Home() {
  const test = async () => {
    await tgCheckMembershipRequest(6425951136, '@deadgens');
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()}>Test</Button>
    </div>
  );
}

'use client'

import { tgCheckMembershipRequest, tgCheckBoostRequest } from "@/utils/requests";
import { deleteSession } from "./auth/session";
import { tgOpenLink, formatLink } from "@/utils/helpers";
import { Button } from "@heroui/button";
import { ServiceNameEnum } from "@/lib/definitions";


export default function Home() {
  const test = async () => {
    // await tgCheckMembershipRequest(6681557705, '@test_channel_chat00800');
    // await tgCheckBoostRequest(5229340312, '@tonlike_app');
    // tgOpenLink('https://t.me/deadgens');

    // let link = '@tonlike_app';
    // let link = 'https://t.me/tonlike_app/';
    // let link = '@daikiserials';
    // let link = 'http://tiktok.com/@daikiserials/';
    let link = 'http://www.twitter.com/tonlike/';
    // let link = '@tonlike';

    console.log('link before', link);
    link = formatLink(link, ServiceNameEnum.X, 'link');
    console.log('link after', link);
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">Test</Button>

      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>
    </div>
  );
}

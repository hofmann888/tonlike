'use client'

import { deleteSession } from "./auth/session";
import { Button } from "@heroui/button";

export default function Home() {
  const test = async () => {
    console.log('test');
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">Test</Button>

      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>
    </div>
  );
}

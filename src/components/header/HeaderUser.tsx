'use client'

import { useUser } from "@/hooks/useUser";
import Image from "next/image";

export default function HeaderUser() {
  const { tgUserName, tgPhotoUrl } = useUser();

  return (
    <div className="header-user">
      <p className="header-user__username">{ tgUserName }</p>

      <div className="header-user__photo">
        <Image
          src={tgPhotoUrl as string}
          width={50}
          height={50}
          className="header-user__photo-img"
          alt="User photo image"
        />
      </div>
    </div>
  )
}
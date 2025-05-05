import { RiAdvertisementFill } from "react-icons/ri";
import { LuUserPlus } from "react-icons/lu";
import { MdTaskAlt } from "react-icons/md";
import { GoGoal } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { ActionNameEnum, ServiceNameEnum } from '@/lib/definitions';
import { BsClipboardCheck } from "react-icons/bs";
import { BsClipboardPlus } from "react-icons/bs";

export const actionIcons = { // TODO: refactor
  [ActionNameEnum.VIEW]: FaEye,
  [ActionNameEnum.CHECK_IN]: MdTaskAlt,
  [ActionNameEnum.AD]: RiAdvertisementFill,
  [ActionNameEnum.INVITE]: LuUserPlus,
  [ActionNameEnum.TASK_CREATE]: BsClipboardPlus,
  [ActionNameEnum.TASK_DONE]: BsClipboardCheck,
  [ActionNameEnum.QUEST_DONE]: GoGoal,
}

// TODO: check share links from mobile
export const serviceLinksMap = {
  [ServiceNameEnum.TELEGRAM]: ['https://t.me/'],
  [ServiceNameEnum.X]: ['https://x.com/', 'https://twitter.com/'],
  [ServiceNameEnum.INSTAGRAM]: ['https://instagram.com/'],
  // acc: https://www.instagram.com/deani.nesss?igsh=MnBnbXMwdnh5eTF5
  // post: https://www.instagram.com/p/DDkWZGANPbh/?igsh=d2tkMGUwYnR6MHV0
  [ServiceNameEnum.TIKTOK]: ['https://tiktok.com/'], 
  // acc: https://www.tiktok.com/@username/
  // video: https://vt.tiktok.com/ZSMPVewdk/
  [ServiceNameEnum.YOUTUBE]: ['https://youtube.com/'], 
  // acc: https://www.youtube.com/channel/UCdp-kaIi7YO2WmNQ-LafmpA = https://www.youtube.com/@wearearchitects
  // video: https://youtu.be/hwXdkQCob6U?si=9Ke5Xqcw39fA5BSK 
  [ServiceNameEnum.VK]: ['https://vk.com/'],
  // post: https://vk.com/wall-124685923_430790
  [ServiceNameEnum.WARPCAST]: ['https://warpcast.com/'],
  // acc: https://warpcast.com/hofmann888
  // channel: https://warpcast.com/~/channel/ru 
  [ServiceNameEnum.TWITCH]: ['https://www.twitch.tv/'],
  [ServiceNameEnum.DISCORD]: ['https://discord.com/'],
}
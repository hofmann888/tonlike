import { Action, BlackListItem, Quest, Service, ServiceAction, Task, TaskEarning, User } from "@/lib/definitions";

// https://nextjs.org/learn/dashboard-app/fetching-data
export const users = [
  { balance: 888, tgId: 6425951136, tgUsername: 'phnx888', tgPhotoUrl: '/globe.svg' },
  { balance: 111, tgId: 11111111, tgUsername: 'user1', tgPhotoUrl: '/globe.svg', referrerId: 1 },
  { balance: 222, tgId: 22222222, tgUsername: 'user2', tgPhotoUrl: '/globe.svg', referrerId: 1 },
  { balance: 333, tgId: 33333333, tgUsername: 'user3', tgPhotoUrl: '/globe.svg', referrerId: 1 },
  { balance: 444, tgId: 44444444, tgUsername: 'user4', tgPhotoUrl: '/globe.svg' },
  { balance: 555, tgId: 55555555, tgUsername: 'user5', tgPhotoUrl: '/globe.svg' },
  { balance: 666, tgId: 66666666, tgUsername: 'user6', tgPhotoUrl: '/globe.svg' },
  { balance: 777, tgId: 77777777, tgUsername: 'user7', tgPhotoUrl: '/globe.svg' },
  { balance: 888, tgId: 88888888, tgUsername: 'user8', tgPhotoUrl: '/globe.svg' },
] as User[];

export const services = [
  { name: 'app', title: 'App', active: false }, // id: 1, //icon: '/img/social/app.png',
  { name: 'link', title: 'Link', icon: '/img/social/link.png', active: true }, // id: 2,
  { name: 'tg', title: 'Telegram', icon: '/img/social/telegram.png', active: true }, // id: 3,
  { name: 'x', title: 'X', icon: '/img/social/x.png', active: true }, // id: 4,
  { name: 'instagram', title: 'Instagram', icon: '/img/social/instagram.png', active: true }, // id: 5,
  { name: 'facebook', title: 'Facebook', icon: '/img/social/facebook.png', active: false }, // id: 6,
  { name: 'tiktok', title: 'TikTok', icon: '/img/social/tiktok.png', active: true }, // id: 7,
  { name: 'likee', title: 'Likee', icon: '/img/social/likee.png', active: false }, // id: 8,
  { name: 'youtube', title: 'YouTube', icon: '/img/social/youtube.png', active: true }, // id: 9,
  { name: 'twitch', title: 'Twitch', icon: '/img/social/twitch.png', active: false }, // id: 10,
  { name: 'discord', title: 'Discord', icon: '/img/social/discord.png', active: false }, // id: 11,
  { name: 'vk', title: 'VKontakte', icon: '/img/social/vk.png', active: true }, // id: 12,
  { name: 'ok', title: 'OK', icon: '/img/social/ok.png', active: false }, // id: 13,
  { name: 'dzen', title: 'Dzen', icon: '/img/social/dzen.png', active: false }, // id: 14,
  { name: 'warpcast', title: 'Warpcast', icon: '/img/social/warpcast.png', active: false }, // id: 15,
  { name: 'test', title: 'test', active: false }, // id: 16,
] as Service[];

export const actions = [
  // Social
  { name: 'view', title: 'View', active: true }, // id: 1,
  { name: 'stream', title: 'Watch Stream', active: false }, // id: 2,
  { name: 'like', title: 'Like', active: true }, // id: 3,
  { name: 'dislike', title: 'Dislike', active: false }, // id: 4,
  { name: 'comment', title: 'Comment', active: true }, // id: 5,
  { name: 'repost', title: 'Repost', active: true }, // id: 6,
  { name: 'story', title: 'Repost to Story', active: false }, // id: 7,
  { name: 'save', title: 'Save', active: false }, // id: 8,
  { name: 'download', title: 'Download', active: false }, // id: 9,
  { name: 'vote', title: 'Vote', active: false }, // id: 10,
  { name: 'friend', title: 'Add to Friends', active: false }, // id: 11,
  { name: 'subscribe', title: 'Subscribe', active: true }, // id: 12,
  { name: 'boost', title: 'Boost', active: true }, // id: 13,
  { name: 'report', title: 'Report', active: false }, // id: 14,
  { name: 'play', title: 'Play App', active: false }, // id: 15,
  // App
  { name: 'check_in', title: 'Check-in', active: true }, // id: 16,
  { name: 'ad', title: 'Watch Ad', active: true }, // id: 17,
  { name: 'invite', title: 'Invite a friend', active: true }, // id: 18,
  { name: 'task_create', title: 'Create a task', active: true }, // id: 19,
  { name: 'task_done', title: 'Complete a task', active: true }, // id: 20,
  { name: 'quest_done', title: 'Complete a quest', active: true }, // id: 21,
  { name: 'ton_tx', title: 'Transaction on TON', active: false }, // id: 22,
  { name: 'kyc', title: 'Sign up + KYC', active: false }, // id: 23,
] as Action[];

export const serviceActions = [
  // App
  { serviceId: 1, actionId: 16, name: 'app_check_in', active: true }, // id: 1,
  { serviceId: 1, actionId: 17, name: 'app_ad', active: true }, // id: 2,
  { serviceId: 1, actionId: 18, name: 'app_invite', active: true }, // id: 3,
  { serviceId: 1, actionId: 19, name: 'app_task_create', active: true }, // id: 4,
  { serviceId: 1, actionId: 20, name: 'app_task_done', active: true }, // id: 5,
  { serviceId: 1, actionId: 21, name: 'app_quest_done', active: true }, // id: 6,
  { serviceId: 1, actionId: 22, name: 'app_ton_tx', active: false }, // id: 8,
  { serviceId: 1, actionId: 23, name: 'app_kyc', active: false }, // id: 9,
  // Link
  { serviceId: 2, actionId: 1, name: 'link_view', active: true }, // id: 11
  // Telegram
  { serviceId: 3, actionId: 1, name: 'tg_view', active: true }, // id: 12,
  { serviceId: 3, actionId: 3, name: 'tg_like', title: 'Reaction', active: true }, // id: 13,
  { serviceId: 3, actionId: 5, name: 'tg_comment', active: true }, // id: 14,
  { serviceId: 3, actionId: 6, name: 'tg_repost', active: true }, // id: 15,
  { serviceId: 3, actionId: 7, name: 'tg_story', active: true }, // id: 16,
  { serviceId: 3, actionId: 10, name: 'tg_vote', active: true }, // id: 17,
  { serviceId: 3, actionId: 12, name: 'tg_subscribe', active: true }, // id: 18,
  { serviceId: 3, actionId: 13, name: 'tg_boost', active: true }, // id: 19,
  { serviceId: 3, actionId: 14, name: 'tg_report', active: false }, // id: 20,
  { serviceId: 3, actionId: 15, name: 'tg_play', title: 'Play Mini App', active: false }, // id: 21,
  // X
  { serviceId: 4, actionId: 1, name: 'x_view', active: true }, // id: 22,
  { serviceId: 4, actionId: 2, name: 'x_stream', active: false }, // id: 23,
  { serviceId: 4, actionId: 3, name: 'x_like', active: true }, // id: 24,
  { serviceId: 4, actionId: 5, name: 'x_comment', active: true }, // id: 25,
  { serviceId: 4, actionId: 6, name: 'x_repost', active: true }, // id: 26,
  { serviceId: 4, actionId: 8, name: 'x_save', title: 'Bookmark', active: true }, // id: 27,
  { serviceId: 4, actionId: 10, name: 'x_vote', active: false }, // id: 28,
  { serviceId: 4, actionId: 12, name: 'x_subscribe', title: 'Follow', active: true }, // id: 29,
  { serviceId: 4, actionId: 14, name: 'x_report', active: false }, // id: 30,
  // Instagram
  { serviceId: 5, actionId: 1, name: 'instagram_view', active: true }, // id: 31,
  { serviceId: 5, actionId: 2, name: 'instagram_stream', active: false }, // id: 32,
  { serviceId: 5, actionId: 3, name: 'instagram_like', active: true }, // id: 33,
  { serviceId: 5, actionId: 5, name: 'instagram_comment', active: true }, // id: 34,
  { serviceId: 5, actionId: 6, name: 'instagram_repost', active: true }, // id: 35,
  { serviceId: 5, actionId: 7, name: 'instagram_story', active: true }, // id: 36,
  { serviceId: 5, actionId: 8, name: 'instagram_save', active: true }, // id: 37,
  { serviceId: 5, actionId: 12, name: 'instagram_subscribe', title: 'Follow', active: true }, // id: 38,
  { serviceId: 5, actionId: 14, name: 'instagram_report', active: false }, // id: 39,
  // Facebook
  { serviceId: 6, actionId: 1, name: 'facebook_view', active: true }, // id: 40,
  { serviceId: 6, actionId: 2, name: 'facebook_stream', active: false }, // id: 41,
  { serviceId: 6, actionId: 3, name: 'facebook_like', active: true }, // id: 42,
  { serviceId: 6, actionId: 5, name: 'facebook_comment', active: true }, // id: 43,
  { serviceId: 6, actionId: 6, name: 'facebook_repost', active: true }, // id: 44,
  { serviceId: 6, actionId: 7, name: 'facebook_story', active: true }, // id: 45,
  { serviceId: 6, actionId: 8, name: 'facebook_save', active: true }, // id: 46,
  { serviceId: 6, actionId: 11, name: 'facebook_friend', active: true }, // id: 47,
  { serviceId: 6, actionId: 12, name: 'facebook_subscribe', title: 'Follow', active: true }, // id: 48,
  { serviceId: 6, actionId: 14, name: 'facebook_report', active: false }, // id: 49,
  // TikTok
  { serviceId: 7, actionId: 1, name: 'tiktok_view', active: true }, // id: 50,
  { serviceId: 7, actionId: 2, name: 'tiktok_stream', active: false }, // id: 51,
  { serviceId: 7, actionId: 3, name: 'tiktok_like', active: true }, // id: 52,
  { serviceId: 7, actionId: 5, name: 'tiktok_comment', active: true }, // id: 53,
  { serviceId: 7, actionId: 6, name: 'tiktok_repost', active: true }, // id: 54,
  { serviceId: 7, actionId: 8, name: 'tiktok_save', title: 'Add to Favorites', active: true }, // id: 55,
  { serviceId: 7, actionId: 9, name: 'tiktok_download', active: true }, // id: 56,
  { serviceId: 7, actionId: 12, name: 'tiktok_subscribe', active: true }, // id: 57,
  { serviceId: 7, actionId: 14, name: 'tiktok_report', active: false }, // id: 58,
  // Likee
  { serviceId: 8, actionId: 1, name: 'likee_view', active: true }, // id: 59,
  { serviceId: 8, actionId: 3, name: 'likee_like', active: true }, // id: 60,
  { serviceId: 8, actionId: 5, name: 'likee_comment', active: true }, // id: 61,
  { serviceId: 8, actionId: 6, name: 'likee_repost', active: true }, // id: 62,
  { serviceId: 8, actionId: 8, name: 'likee_save', title: 'Add to Favorites', active: true }, // id: 63,
  { serviceId: 8, actionId: 9, name: 'likee_download', active: true }, // id: 64,
  { serviceId: 8, actionId: 12, name: 'likee_subscribe', active: true }, // id: 65,
  { serviceId: 8, actionId: 14, name: 'likee_report', active: false }, // id: 66,
  // Youtube
  { serviceId: 9, actionId: 1, name: 'youtube_view', title: 'Watch a video', active: true }, // id: 67,
  { serviceId: 9, actionId: 2, name: 'youtube_stream', active: false }, // id: 68,
  { serviceId: 9, actionId: 3, name: 'youtube_like', active: true }, // id: 69,
  { serviceId: 9, actionId: 4, name: 'youtube_dislike', active: false }, // id: 70,
  { serviceId: 9, actionId: 5, name: 'youtube_comment', active: true }, // id: 71,
  { serviceId: 9, actionId: 6, name: 'youtube_repost', active: true }, // id: 72,
  { serviceId: 9, actionId: 8, name: 'youtube_save', title: 'Save to Playlist', active: true }, // id: 73,
  { serviceId: 9, actionId: 9, name: 'youtube_download', active: true }, // id: 74,
  { serviceId: 9, actionId: 12, name: 'youtube_subscribe', active: true }, // id: 75,
  { serviceId: 9, actionId: 14, name: 'youtube_report', active: false }, // id: 76,
  // Twitch
  { serviceId: 10, actionId: 1, name: 'twitch_view', active: true }, // id: 77,
  { serviceId: 10, actionId: 2, name: 'twitch_stream', active: false }, // id: 78,
  { serviceId: 10, actionId: 12, name: 'twitch_subscribe', title: 'Follow', active: true }, // id: 79,
  { serviceId: 10, actionId: 14, name: 'twitch_report', active: false }, // id: 80,
  // Discord
  { serviceId: 11, actionId: 3, name: 'discord_like', title: 'React', active: true }, // id: 81,
  { serviceId: 11, actionId: 12, name: 'discord_subscribe', title: 'Subscribe', active: true }, // id: 82,
  { serviceId: 11, actionId: 13, name: 'discord_boost', active: true }, // id: 83,
  { serviceId: 11, actionId: 14, name: 'discord_report', active: false }, // id: 84,
  // VK
  { serviceId: 12, actionId: 1, name: 'vk_view', active: true }, // id: 85,
  { serviceId: 12, actionId: 3, name: 'vk_like', active: true }, // id: 86,
  { serviceId: 12, actionId: 5, name: 'vk_comment', active: true }, // id: 87,
  { serviceId: 12, actionId: 6, name: 'vk_repost', active: true }, // id: 88,
  { serviceId: 12, actionId: 7, name: 'vk_story', active: true }, // id: 89,
  { serviceId: 12, actionId: 8, name: 'vk_save', title: 'Add to Bookmarks', active: true }, // id: 90,
  { serviceId: 12, actionId: 10, name: 'vk_vote', active: true }, // id: 91,
  { serviceId: 12, actionId: 11, name: 'vk_friend', active: true }, // id: 92,
  { serviceId: 12, actionId: 12, name: 'vk_subscribe', title: 'Follow', active: true }, // id: 93,
  { serviceId: 12, actionId: 14, name: 'vk_report', active: false }, // id: 94,
  // OK
  // Dzen
  // Warpcast
  // { serviceId: 15, actionId: 1, name: 'warpcast_view', active: true }, // id: 28,
  // { serviceId: 15, actionId: 2, name: 'warpcast_like', active: true }, // id: 29,
  // { serviceId: 15, actionId: 3, name: 'warpcast_repost', title: 'Recast', active: true }, // id: 30,
  // { serviceId: 15, actionId: 4, name: 'warpcast_comment', title: 'Reply', active: true }, // id: 31,
  // { serviceId: 15, actionId: 6, name: 'warpcast_subscribe', title: 'Follow', active: true }, // id: 32,
] as ServiceAction[];

export const tasks = [
  { userId: 2, serviceActionId: 12, link: 'https://t.me/tonlike_app/', price: 1, count: 101, status: 'active' }, // id: 1 # tg_view
  { userId: 2, serviceActionId: 18, link: 'https://t.me/tonlike_app/', price: 2, count: 102, status: 'active' }, // id: 2 # tg_subscribe
  { userId: 2, serviceActionId: 19, link: 'https://t.me/tonlike_app/', price: 3, count: 103, status: 'active' }, // id: 3 # tg_boost
  { userId: 3, serviceActionId: 22, link: 'https://x.com/RealXavier011/status/1895042084232401143', price: 4, count: 104, status: 'active' }, // id: 4 # x_view
  { userId: 4, serviceActionId: 31, link: 'https://www.instagram.com/p/DDkWZGANPbh/?igsh=d2tkMGUwYnR6MHV0', price: 5, count: 105, status: 'active' }, // id: 5 # instagram_view
  { userId: 5, serviceActionId: 50, link: 'https://vt.tiktok.com/ZSMPVewdk/', price: 6, count: 106, status: 'active' }, // id: 6 # tiktok_view
  { userId: 6, serviceActionId: 67, link: 'https://youtu.be/hwXdkQCob6U?si=9Ke5Xqcw39fA5BSK', price: 7, count: 107, status: 'active' }, // id: 7 # youtube_view
  { userId: 7, serviceActionId: 85, link: 'https://vk.com/wall-124685923_430790', price: 8, count: 108, status: 'active' }, // id: 8 # vk_view
  { userId: 8, serviceActionId: 11, link: 'https://www.google.com/', price: 9, count: 109, status: 'active' }, // id: 9 # link_view
  { userId: 8, serviceActionId: 11, link: 'https://www.google.com/', price: 10, count: 110, status: 'paused' }, // id: 10 # link_view
  { userId: 8, serviceActionId: 11, link: 'https://www.google.com/', price: 11, count: 111, status: 'done' }, // id: 11 # link_view
  { userId: 8, serviceActionId: 11, link: 'https://www.google.com/', price: 12, count: 112, status: 'deleted' }, // id: 12 # link_view
  { userId: 8, serviceActionId: 11, link: 'https://www.google.com/', price: 13, count: 113, status: 'active' }, // id: 13 # link_view (task_earnings)
  { userId: 8, serviceActionId: 20, link: 'https://t.me/tonlike_app/', price: 14, count: 114, status: 'active' }, // id: 14 # tg_report
  { userId: 8, serviceActionId: 40, link: 'https://www.facebook.com/VIKRAMINFINITY/posts/pfbid0NMrThjrpMN6WKLMAmHBVRjXc7CiDEyRkWjHejqk8ZfxVGEmMTh9JJSq8X6h5QvU5l', price: 15, count: 115, status: 'active' }, // id: 15 # facebook_view
  { userId: 9, serviceActionId: 11, link: 'https://www.google.com/', price: 16, count: 116, status: 'active' }, // id: 16 # link_view (black_list)
] as Task[];

export const taskEarnings = [
  { userId: 1, taskId: 13, profit: 13 }
] as TaskEarning[];

export const quests = [
  { serviceActionId: 1, price: 1, countPerUser: 1, daily: true, priority: 100 }, // id: 1 # app_check_in
  { serviceActionId: 2, price: 2, countPerUser: 20, daily: true, priority: 95 },  // id: 2 # app_ad
  { serviceActionId: 5, price: 3, countPerUser: 1, daily: true, priority: 90 },  // id: 3 # app_task_done
  { serviceActionId: 18, price: 4, countPerUser: 1, daily: false, priority: 85, link: 'https://t.me/tonlike_app/' },  // id: 4 # tg_subscribe
  { serviceActionId: 19, price: 5, countPerUser: 1, daily: false, priority: 80, link: 'https://t.me/tonlike_app/' },  // id: 5 # tg_boost
  { serviceActionId: 29, price: 6, countPerUser: 1, daily: false, priority: 75, link: 'https://x.com/cz_binance/status/1894996181752619322?t=hn1MPoJzZBbYvgZh9YhiSQ&s=19' },  // id: 6 # x_subscribe
  { serviceActionId: 3, price: 7, countPerUser: 1, daily: false, priority: 70 },  // id: 7 # app_invite
  { serviceActionId: 3, price: 8, countPerUser: 5, daily: false, priority: 65, title: 'Invite 5 friends' },  // id: 8 # app_invite
  { serviceActionId: 4, price: 9, countPerUser: 1, daily: false, priority: 60, title: 'Create a task' },  // id: 9 # app_task_create
  { serviceActionId: 4, price: 10, countPerUser: 5, daily: false, priority: 55, title: 'Create 5 tasks' },  // id: 10 # app_task_create
  { serviceActionId: 5, price: 11, countPerUser: 5, daily: false, priority: 50, title: 'Complete 5 tasks' },  // id: 11 # app_task_done
  { serviceActionId: 6, price: 12, countPerUser: 5, daily: false, priority: 45, title: 'Complete 5 quests' },  // id: 12 # app_quest_done
  { serviceActionId: 8, price: 13, countPerUser: 1, daily: false, priority: 40 },  // id: 13 # app_ton_tx
  { serviceActionId: 1, price: 13, countPerUser: 1, daily: false, priority: 1, title: 'Test not active', active: false },  // id: 14 # app_check_in
] as Quest[];

export const blackList = [
  { userId: 9, blockedUserId: 1, reasons: ['task', 'account'], comment: 'stupid motherfucker and fucking piece of shit with a dead brain' }
] as BlackListItem[];

// export const reports = [
//   {
//     id: 1,
//     user_id: 1,
//     task_id: 5,
//     reasons: ['unavailable', 'content'],
//     comment: 'shit task',
//   },
// ];
// https://nextjs.org/learn/dashboard-app/fetching-data
export const users = [
  { 
    balance: 888,
    tgId: 6425951136,
    tgUsername: 'phnx888',
    tgPhotoUrl: '/globe.svg',
  },
  { 
    referrerId: 1,
    balance: 111,
    tgId: 11111111,
    tgUsername: 'user1',
    tgPhotoUrl: '/globe.svg',
  },
  { 
    balance: 222,
    tgId: 22222222,
    tgUsername: 'user2',
    tgPhotoUrl: '/globe.svg',
  },
];

export const services = [
  { name: 'app', title: 'App', active: false }, // id: 1, //icon: '/img/social/app.png',
  { name: 'tg', title: 'Telegram', icon: '/img/social/telegram.png', active: true }, // id: 2,
  { name: 'x', title: 'X', icon: '/img/social/x.png', active: true }, // id: 3,
  { name: 'instagram', title: 'Instagram', icon: '/img/social/instagram.png', active: true }, // id: 4,
  { name: 'tiktok', title: 'TikTok', icon: '/img/social/tiktok.png', active: true }, // id: 5,
  { name: 'youtube', title: 'YouTube', icon: '/img/social/youtube.png', active: true }, // id: 6,
  { name: 'vk', title: 'VKontakte', icon: '/img/social/vk.png', active: true }, // id: 7,
  { name: 'farcaster', title: 'Farcaster', icon: '/img/social/farcaster.png', active: true }, // id: 8,
  { name: 'link', title: 'Link', icon: '/img/social/link.png', active: true }, // id: 9,
  { name: 'test', title: 'test', active: false }, // id: 10,
];

export const actions = [
  // Tasks
  { name: 'view', title: 'View', active: true }, // id: 1,
  { name: 'like', title: 'Like', active: true }, // id: 2,
  { name: 'repost', title: 'Repost', active: true }, // id: 3,
  { name: 'comment', title: 'Comment', active: true }, // id: 4,
  { name: 'vote', title: 'Vote', active: true }, // id: 5,
  { name: 'subscribe', title: 'Subscribe', active: true}, // id: 6,
  { name: 'boost', title: 'Boost', active: true }, // id: 7,
  // Quests
  { name: 'check_in', title: 'Check-in', active: true }, // id: 8,
  { name: 'ad', title: 'Watch Ad', active: true }, // id: 9,
  { name: 'invite', title: 'Invite a friend', active: true }, // id: 10,
  { name: 'task', title: 'Complete a task', active: true }, // id: 11,
  { name: 'quest', title: 'Complete a quest', active: true }, // id: 12,
  { name: 'kyc', title: 'Sign up to exchange + KYC', active: true }, // id: 13,
];

export const serviceActions = [
  // Telegram
  { serviceId: 2, actionId: 1, active: true }, // id: 1,
  { serviceId: 2, actionId: 2, active: true }, // id: 2,
  { serviceId: 2, actionId: 4, active: true }, // id: 3,
  { serviceId: 2, actionId: 5, active: true }, // id: 4,
  { serviceId: 2, actionId: 6, active: true }, // id: 5,
  { serviceId: 2, actionId: 7, active: true }, // id: 6,
  // X
  { serviceId: 3, actionId: 2, active: true }, // id: 7,
  { serviceId: 3, actionId: 3, active: true }, // id: 8,
  { serviceId: 3, actionId: 4, active: true }, // id: 9,
  { serviceId: 3, actionId: 6, active: true }, // id: 10,
  // Instagram
  { serviceId: 4, actionId: 1, active: true }, // id: 11,
  { serviceId: 4, actionId: 2, active: true }, // id: 12,
  { serviceId: 4, actionId: 4, active: true }, // id: 13,
  { serviceId: 4, actionId: 6, active: true }, // id: 14,
  // TikTok
  { serviceId: 5, actionId: 1, active: true }, // id: 15,
  { serviceId: 5, actionId: 2, active: true }, // id: 16,
  { serviceId: 5, actionId: 4, active: true }, // id: 17,
  { serviceId: 5, actionId: 6, active: true }, // id: 18,
  // Youtube
  { serviceId: 6, actionId: 1, active: true }, // id: 19,
  { serviceId: 6, actionId: 2, active: true }, // id: 20,
  { serviceId: 6, actionId: 6, active: true }, // id: 21,
  // VK
  { serviceId: 7, actionId: 1, active: true }, // id: 22,
  { serviceId: 7, actionId: 2, active: true }, // id: 23,
  { serviceId: 7, actionId: 3, active: true }, // id: 24,
  { serviceId: 7, actionId: 4, active: true }, // id: 25,
  { serviceId: 7, actionId: 5, active: true }, // id: 26,
  { serviceId: 7, actionId: 6, active: true }, // id: 27,
  // Farcaster
  { serviceId: 8, actionId: 1, active: true }, // id: 28,
  // Link
  { serviceId: 9, actionId: 1, active: true }, // id: 29,
  // App
  { serviceId: 1, actionId: 8, active: true }, // id: 30,
  { serviceId: 1, actionId: 9, active: true }, // id: 31,
  { serviceId: 1, actionId: 10, active: true }, // id: 32,
  { serviceId: 1, actionId: 11, active: true }, // id: 33,
  { serviceId: 1, actionId: 12, active: true }, // id: 34,
  { serviceId: 1, actionId: 13, active: true }, // id: 35,

]

export const tasks = [
  {
    id: 1,
    user_id: 1,
    action_id: 1,
    service_id: 1,
    link: 'link1',
    price: 1,
    count: 111,
    done: 0,
    status: 'active',
  },
  {
    id: 2,
    user_id: 1,
    action_id: 2,
    service_id: 2,
    link: 'link2',
    price: 2,
    count: 222,
    done: 22,
    status: 'active',
  },
  {
    id: 3,
    user_id: 1,
    action_id: 3,
    service_id: 3,
    link: 'link3',
    price: 3,
    count: 333,
    done: 33,
    status: 'paused',
  },
  {
    id: 4,
    user_id: 1,
    action_id: 4,
    service_id: 4,
    link: 'link4',
    price: 4,
    count: 444,
    done: 444,
    status: 'done',
  },
  {
    id: 5,
    user_id: 2,
    action_id: 5,
    service_id: 5,
    link: 'link5',
    price: 5,
    count: 555,
    done: 55,
    status: 'paused',
  },
  {
    id: 6,
    user_id: 2,
    action_id: 6,
    service_id: 6,
    link: 'link6',
    price: 6,
    count: 666,
    done: 666,
    status: 'done',
  },
  {
    id: 7, // done by user1
    user_id: 2,
    action_id: 1,
    service_id: 1,
    link: 'link7',
    price: 7,
    count: 777,
    done: 77,
    status: 'active',
  },
  {
    id: 8,
    user_id: 2,
    action_id: 1,
    service_id: 1,
    link: 'link8',
    price: 8,
    count: 888,
    done: 0,
    status: 'active',
  },
];

export const taskEarnings = [
  {
    id: 1,
    user_id: 1,
    task_id: 7,
    profit: 7,
    status: 'done',
  }
];

export const quests = [
  { // Check-inn
    // id: 1,
    serviceId: 1,
    actionId: 8,
    price: 1,
    countPerUser: 1,
    daily: true,
    priority: 100,
  },
  { // Whatch Ad
    // id: 2,
    serviceId: 1,
    actionId: 9,
    price: 2,
    countPerUser: 20,
    daily: true,
    priority: 95,
  },
  { // Complete a task
    // id: 3,
    serviceId: 1,
    actionId: 11,
    price: 3,
    countPerUser: 1,
    daily: true,
    priority: 90,
  },
  { // Subsctibe to App tg
    // id: 4,
    serviceId: 2,
    actionId: 6,
    link: '@myapp',
    price: 4,
    countPerUser: 1,
    daily: false,
    priority: 85,
  },
  { // Retweet Partner x post
    // id: 5,
    serviceId: 3,
    actionId: 3,
    link: '@partner.x.link',
    price: 5,
    countPerUser: 1,
    daily: false,
    priority: 80,
  },
  { // Invite a friend
    // id: 6,
    serviceId: 1,
    actionId: 10,
    price: 6,
    countPerUser: 1,
    daily: false,
    priority: 75,
  },
  { // Invite 5 friends
    // id: 7,
    serviceId: 1,
    actionId: 10,
    title: 'Invite 5 friends',
    price: 7,
    countPerUser: 5,
    daily: false,
    priority: 70,
  },
  { // Complete 5 tasks
    // id: 8,
    serviceId: 1,
    actionId: 11,
    title: 'Complete 5 tasks',
    price: 8,
    countPerUser: 5,
    daily: false,
    priority: 65,
  },
  { // Complete 5 quests
    // id: 9,
    serviceId: 1,
    actionId: 12,
    title: 'Complete 5 quests',
    price: 9,
    countPerUser: 5,
    daily: false,
    priority: 60,
  },
  { // Sign app to exchange + KYC
    // id: 10,
    serviceId: 1,
    actionId: 13,
    price: 10,
    countPerUser: 1,
    daily: false,
    priority: 50,
  },
  { // not active test
    // id: 10,
    serviceId: 1,
    actionId: 1,
    title: 'test',
    price: 1,
    countPerUser: 1,
    daily: false,
    priority: 1,
    active: false,
  },
];

export const reports = [
  {
    id: 1,
    user_id: 1,
    task_id: 5,
    reasons: ['unavailable', 'content'],
    comment: 'shit task',
  },
];

export const blackList = [
  {
    id: 1,
    user_id: 1,
    blocked_user_id: 2,
    reasons: ['task', 'account'],
    task_id: 2,
    comment: 'stupid motherfucker and fucking piece of shit with a dead brain',
  }
];
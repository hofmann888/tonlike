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
  {
    // id: 1,
    name: 'Telegram',
    icon: '/img/social/telegram.png',
    active: true,
  },
  {
    // id: 2,
    name: 'X',
    icon: '/img/social/x.png',
    active: true,
  },
  {
    // id: 3,
    name: 'Instagram',
    icon: '/img/social/instagram.png',
    active: true,
  },
  {
    // id: 4,
    name: 'TikTok',
    icon: '/img/social/tiktok.png',
    active: true,
  },
  {
    // id: 5,
    name: 'YouTube',
    icon: '/img/social/youtube.png',
    active: true,
  },
  {
    // id: 6,
    name: 'VK',
    icon: '/img/social/vk.png',
    active: true,
  },
  {
    // id: 7,
    name: 'Farcaster',
    icon: '/img/social/farcaster.png',
    active: true,
  },
  {
    // id: 8,
    name: 'Link',
    icon: '/img/social/link.png',
    active: true,
  },
  {
    // id: 8,
    name: 'test',
    active: false,
  },
];

export const actions = [
  {
    // id: 1,
    name: 'View',
    active: true,
  },
  {
    // id: 2,
    name: 'Like',
    active: true,
  },
  {
    // id: 3,
    name: 'Repost',
    active: true,
  },
  {
    // id: 4,
    name: 'Comment',
    active: true,
  },
  {
    // id: 5,
    name: 'Vote',
    active: true,
  },
  {
    // id: 6,
    name: 'Subscribe',
    active: true,
  },
  {
    // id: 7,
    name: 'Boost',
    active: true,
  },
];

export const serviceActions = [
  // Telegram
  {
    // id: 1,
    serviceId: 1,
    actionId: 1,
    active: true,
  },
  {
    // id: 2,
    serviceId: 1,
    actionId: 2,
    active: true,
  },
  {
    // id: 3,
    serviceId: 1,
    actionId: 4,
    active: true,
  },
  {
    // id: 4,
    serviceId: 1,
    actionId: 5,
    active: true,
  },
  {
    // id: 5,
    serviceId: 1,
    actionId: 6,
    active: true,
  },
  {
    // id: 6,
    serviceId: 1,
    actionId: 7,
    active: true,
  },
  // X
  {
    // id: 7,
    serviceId: 2,
    actionId: 2,
    active: true,
  },
  {
    // id: 8,
    serviceId: 2,
    actionId: 3,
    active: true,
  },
  {
    // id: 9,
    serviceId: 2,
    actionId: 4,
    active: true,
  },
  {
    // id: 10,
    serviceId: 2,
    actionId: 6,
    active: true,
  },
  // Instagram
  {
    // id: 11,
    serviceId: 3,
    actionId: 1,
    active: true,
  },
  {
    // id: 12,
    serviceId: 3,
    actionId: 2,
    active: true,
  },
  {
    // id: 13,
    serviceId: 3,
    actionId: 4,
    active: true,
  },
  {
    // id: 14,
    serviceId: 3,
    actionId: 6,
    active: true,
  },
  // TikTok
  {
    // id: 15,
    serviceId: 4,
    actionId: 1,
    active: true,
  },
  {
    // id: 16,
    serviceId: 4,
    actionId: 2,
    active: true,
  },
  {
    // id: 17,
    serviceId: 4,
    actionId: 4,
    active: false,
  },
  {
    // id: 18,
    serviceId: 4,
    actionId: 6,
    active: true,
  },
  // Youtube
  {
    // id: 19,
    serviceId: 5,
    actionId: 1,
    active: true,
  },
  {
    // id: 20,
    serviceId: 5,
    actionId: 2,
    active: true,
  },
  {
    // id: 21,
    serviceId: 5,
    actionId: 6,
    active: false,
  },
  // VK
  {
    // id: 22,
    serviceId: 6,
    actionId: 1,
    active: true,
  },
  {
    // id: 23,
    serviceId: 6,
    actionId: 2,
    active: true,
  },
  {
    // id: 24,
    serviceId: 6,
    actionId: 3,
    active: true,
  },
  {
    // id: 25,
    serviceId: 6,
    actionId: 4,
    active: true,
  },
  {
    // id: 26,
    serviceId: 6,
    actionId: 5,
    active: true,
  },
  {
    // id: 27,
    serviceId: 6,
    actionId: 6,
    active: true,
  },
  // Link
  {
    // id: 28,
    serviceId: 7,
    actionId: 1,
    active: true,
  },
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

export const userEarnings = [
  {
    id: 1,
    user_id: 1,
    task_id: 7,
    profit: 7,
    status: 'done',
  }
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
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: 1,
    address: '0QCXwrih_8H9sGnGUBtgT0PpOzcoNZJkfWy901UjbmN6j8te', // dev v4
    balance: 8.00,
    reward: 888,
    tg_id: 6425951136,
    tg_username: 'phnx888',
    tg_photo_url: '/globe.svg',
  },
  {
    id: 2,
    address: '0QAlxQyTt5ru_L9MUXggLciPxv-8HCjNbVrgn7LFVwDxxH7v', // dev w5 (desktop)
    balance: 0.00,
    reward: 0,
    tg_id: 123,
    tg_username: 'someusername',
    tg_photo_url: '/globe.svg',
  },
];

const services = [
  {
    id: 1,
    name: 'Telegram',
    img: '/img/social/telegram.png',
    active: true,
  },
  {
    id: 2,
    name: 'X',
    img: '/img/social/x.png',
    active: true,
  },
  {
    id: 3,
    name: 'Instagram',
    img: '/img/social/instagram.png',
    active: true,
  },
  {
    id: 4,
    name: 'TikTok',
    img: '/img/social/tiktok.png',
    active: true,
  },
  {
    id: 5,
    name: 'YouTube',
    img: '/img/social/youtube.png',
    active: true,
  },
  {
    id: 6,
    name: 'VK',
    img: '/img/social/vk.png',
    active: true,
  },
  {
    id: 7,
    name: 'Link',
    img: '/img/social/link.png',
    active: true,
  },
];

const actions = [
  {
    id: 1,
    name: 'View',
    reward: 1,
    active: true,
  },
  {
    id: 2,
    name: 'Like',
    reward: 2,
    active: true,
  },
  {
    id: 3,
    name: 'Repost',
    reward: 3,
    active: true,
  },
  {
    id: 4,
    name: 'Comment',
    reward: 4,
    active: true,
  },
  {
    id: 5,
    name: 'Vote',
    reward: 5,
    active: true,
  },
  {
    id: 6,
    name: 'Subscribe',
    reward: 6,
    active: true,
  },
  {
    id: 7,
    name: 'Boost',
    reward: 7,
    active: true,
  },
];

const serviceActions = [
  // Telegram
  {
    id: 1,
    service_id: 1,
    action_id: 1,
    active: true,
  },
  {
    id: 2,
    service_id: 1,
    action_id: 2,
    active: true,
  },
  {
    id: 3,
    service_id: 1,
    action_id: 4,
    active: true,
  },
  {
    id: 4,
    service_id: 1,
    action_id: 5,
    active: true,
  },
  {
    id: 5,
    service_id: 1,
    action_id: 6,
    active: true,
  },
  {
    id: 6,
    service_id: 1,
    action_id: 7,
    active: true,
  },
  // X
  {
    id: 7,
    service_id: 2,
    action_id: 2,
    active: true,
  },
  {
    id: 8,
    service_id: 2,
    action_id: 3,
    active: true,
  },
  {
    id: 9,
    service_id: 2,
    action_id: 4,
    active: true,
  },
  {
    id: 10,
    service_id: 2,
    action_id: 6,
    active: true,
  },
  // Instagram
  {
    id: 11,
    service_id: 3,
    action_id: 1,
    active: true,
  },
  {
    id: 12,
    service_id: 3,
    action_id: 2,
    active: true,
  },
  {
    id: 13,
    service_id: 3,
    action_id: 4,
    active: true,
  },
  {
    id: 14,
    service_id: 3,
    action_id: 6,
    active: true,
  },
  // TikTok
  {
    id: 15,
    service_id: 4,
    action_id: 1,
    active: true,
  },
  {
    id: 16,
    service_id: 4,
    action_id: 2,
    active: true,
  },
  {
    id: 17,
    service_id: 4,
    action_id: 4,
    active: false,
  },
  {
    id: 18,
    service_id: 4,
    action_id: 6,
    active: true,
  },
  // Youtube
  {
    id: 19,
    service_id: 5,
    action_id: 1,
    active: true,
  },
  {
    id: 20,
    service_id: 5,
    action_id: 2,
    active: true,
  },
  {
    id: 21,
    service_id: 5,
    action_id: 6,
    active: false,
  },
  // VK
  {
    id: 22,
    service_id: 6,
    action_id: 1,
    active: true,
  },
  {
    id: 23,
    service_id: 6,
    action_id: 2,
    active: true,
  },
  {
    id: 24,
    service_id: 6,
    action_id: 3,
    active: true,
  },
  {
    id: 25,
    service_id: 6,
    action_id: 4,
    active: true,
  },
  {
    id: 26,
    service_id: 6,
    action_id: 5,
    active: true,
  },
  {
    id: 27,
    service_id: 6,
    action_id: 6,
    active: true,
  },
  // Link
  {
    id: 28,
    service_id: 7,
    action_id: 1,
    active: true,
  },
]

const tasks = [
  {
    id: 1,
    user_id: 1,
    action_id: 1,
    service_id: 1,
    link: 'link1',
    price: 0.01,
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
    price: 0.02,
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
    price: 0.03,
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
    price: 0.04,
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
    price: 0.05,
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
    price: 0.06,
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
    price: 0.07,
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
    price: 0.08,
    count: 888,
    done: 0,
    status: 'active',
  },
];

const tasksDone = [
  {
    id: 1,
    user_id: 1,
    task_id: 7,
  }
];

export { services, actions, serviceActions, tasks, tasksDone, users };

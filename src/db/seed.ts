// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: 1,
    tg_id: 6425951136,
    address: '0QCXwrih_8H9sGnGUBtgT0PpOzcoNZJkfWy901UjbmN6j8te', // dev v4
    balance: 8.00,
    reward: 888,
  },
  {
    id: 2,
    tg_id: 123,
    address: '0QAlxQyTt5ru_L9MUXggLciPxv-8HCjNbVrgn7LFVwDxxH7v', // dev w5 (desktop)
    balance: 0.00,
    reward: 0,
  },
];

const services = [
  {
    id: 1,
    name: 'Telegram',
  },
  {
    id: 2,
    name: 'X',
  },
  {
    id: 3,
    name: 'Instagram',
  },
  {
    id: 4,
    name: 'TikTok',
  },
  {
    id: 5,
    name: 'YouTube',
  },
  {
    id: 5,
    name: 'VK',
  },
  {
    id: 6,
    name: 'Link',
  },
];

const actions = [
  {
    id: 1,
    name: 'View',
    reward: 1,
  },
  {
    id: 2,
    name: 'Like',
    reward: 2,
  },
  {
    id: 3,
    name: 'Repost',
    reward: 3,
  },
  {
    id: 4,
    name: 'Subscribe',
    reward: 4,
  },
  {
    id: 5,
    name: 'Comment',
    reward: 5,
  },
  {
    id: 6,
    name: 'Vote',
    reward: 6,
  },
];

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
    status: 'stop',
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
    status: 'stop',
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

export { actions, services, tasks, tasksDone, users };

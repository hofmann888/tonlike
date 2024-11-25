// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: 1,
    address: '0QCXwrih_8H9sGnGUBtgT0PpOzcoNZJkfWy901UjbmN6j8te', // dev v4
    balance: 8.00,
    reward: 888,
  },
  {
    id: 2,
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
    name: 'YouTube',
  },
  {
    id: 4,
    name: 'Link',
  },
];

const actions = [
  {
    id: 1,
    name: 'Click',
    reward: 1,
  },
  {
    id: 2,
    name: 'Subscribe',
    reward: 2,
  },
  {
    id: 3,
    name: 'Comment',
    reward: 3,
  },
];

// const tasks = [];

// const tasks_done = [];

export { users, services, actions };

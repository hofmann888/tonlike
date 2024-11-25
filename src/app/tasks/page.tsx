'use client';

import { Task } from "../lib/definitions";
import TaskItem from "../components/tasks-page/task-item";
import Link from "next/link";
import "../css/tasks.scss";

const tasks: Task[] = [
  { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  { 'service': 'telegram', 'action': 'comment', 'price': 1.1, 'count': 88, done: 69 },
  { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 }
]

export default async function TasksPage() {
  return (
    <div className="tasks-page">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem task={task} />
        ))}
      </div>

        <div className="new-task">
          <Link href="/new-task" className="new-task-btn">
            New Task
          </Link>
        </div>
    </div>
  )
}
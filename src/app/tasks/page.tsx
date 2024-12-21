'use client';

import { Task } from "@/lib/definitions";
import TaskItem from "@/components/TasksPage/TaskItem";
import Link from "next/link";
import "@/css/tasks.scss";

const tasks: Task[] = [
  { 'id': 1, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 2, 'service': 'telegram', 'action': 'comment', 'link': '', 'price': 1.1, 'count': 88, done: 69 },
  { 'id': 3, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 4, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 5, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 5, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 }
];

export default function TasksPage() {
  return (
    <div className="tasks-page">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
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
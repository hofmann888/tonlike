import EarnItem from "../components/earn-page/earn-item";
import { Task } from "../lib/definitions";
import Link from "next/link";
import "../css/earn.scss";

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

export default async function EarnPage() {
  return (
    <div className="earn-page">
      <div className="earn-list">
        {tasks.map((task) => (
          <EarnItem task={task} />
        ))}
      </div>
    </div>
  )
}
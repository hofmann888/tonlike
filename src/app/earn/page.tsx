import EarnItem from "@/components/EarnPage/EarnItem";
import { Task } from "@/lib/definitions";
import "@/css/earn.scss";

const tasks: Task[] = [
  { 'id': 1, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 2, 'service': 'telegram', 'action': 'comment', 'link': '', 'price': 1.1, 'count': 88, done: 69 },
  { 'id': 3, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 4, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 5, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  { 'id': 6, 'service': 'telegram', 'action': 'subscribe', 'link': '', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 },
  // { 'service': 'telegram', 'action': 'subscribe', 'price': 0.8, 'count': 888, done: 33 }
];

export default function EarnPage() {
  return (
    <div className="earn-page">
      <div className="earn-list">
        {tasks.map((task) => (
          <EarnItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
'use client'

import { Task } from "@/lib/definitions";
import ProgressBar from "@ramonak/react-progress-bar";

export default function TaskItem({task}: {task: Task}) {
  return (
    <div className="task-item">
      <p>Service: {task.service.name}</p>
      <p>Link: {task.link}</p>
      <p>Action: {task.action.name}</p>
      <p>Price: {task.price}</p>
      <p>Progress: {task.done} / {task.count}</p>

      <ProgressBar completed={task.done} maxCompleted={task.count} customLabel=" " />
    </div>
  )
}
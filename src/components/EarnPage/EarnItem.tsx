import { Task } from "@/lib/definitions";
import { FaTelegramPlane } from "react-icons/fa";

export default function EarnItem({task}: {task: Task}) {
  return (
    <div className="earn-item">
      <div className="earn-item-icon">
        <FaTelegramPlane className="w-7 h-7" />
      </div>
      <div className="earm-item-info">
        {task.action.name}
      </div>
      <div className="earn-item-price">
        {task.price}
      </div>
    </div>
  )
}
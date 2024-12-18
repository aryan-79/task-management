import { cn } from "@/utils/cn";
import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import TaskForm from "../modals/TaskForm";
import { useOutsideClick } from "@/hooks/useClickOutside";

export enum STATUS {
  ONGOING,
  COMPLETED,
  OVERDUE,
}

export interface ITaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: number;
}
const TaskItem: React.FC<ITaskItem> = ({
  title,
  description,
  dueDate,
  status,
}) => {
  const [showOption, setShowOption] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);
  useOutsideClick(optionsRef, () => setShowOption(false));
  return (
    <div className="border border-background-muted p-4 rounded-md shadow-sm space-y-2">
      <div className="flex justify-between items-center relative">
        <p className="text-xl font-semibold">{title}</p>
        <button type="button" onClick={() => setShowOption(!showOption)}>
          <MoreVertical className="size-5" />
        </button>
        {showOption && (
          <ul
            className="absolute right-2 top-full w-max rounded-sm bg-background-muted"
            ref={optionsRef}
          >
            <li
              className="cursor-pointer hover:bg-foreground-muted hover:text-white dark:hover:text-black p-2"
              onClick={() => {
                setShowEditModal(!showEditModal);
                setShowOption(false);
              }}
            >
              Edit
            </li>
            <li className="cursor-pointer hover:bg-foreground-muted hover:text-white dark:hover:text-black p-2">
              Mark as Completed
            </li>
          </ul>
        )}
      </div>
      <p className="font-medium text-lg">{description}</p>
      <div className="flex gap-4">
        <p>Due Date: {dueDate}</p>
        <p
          className={cn(
            status === 0
              ? "text-orange-400"
              : status === 1
              ? "text-green-400"
              : "text-red-500"
          )}
        >
          Status: {STATUS[status]}
        </p>
      </div>
      {showEditModal && (
        <TaskForm
          type="edit"
          name={title}
          description={description}
          dueDate={dueDate}
          status={STATUS[status] as "ONGOING" | "COMPLETED" | "OVERDUE"}
          close={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;

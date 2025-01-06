import { cn } from "@/utils/cn";
import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import TaskForm from "../modals/TaskForm";
import { useOutsideClick } from "@/hooks/useClickOutside";
import { Task } from "@/types/api-response";

const TaskItem: React.FC<Task> = ({ name, description, dueDate, status }) => {
  const [showOption, setShowOption] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);
  useOutsideClick(optionsRef, () => setShowOption(false));
  return (
    <div className="border border-background-muted p-4 rounded-md shadow-sm space-y-2">
      <div className="flex justify-between items-center relative">
        <p className="text-xl font-semibold">{name}</p>
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
            status === "IN_PROGRESS"
              ? "text-orange-400"
              : status === "COMPLETED"
              ? "text-green-400"
              : "text-red-500"
          )}
        >
          Status: {status}
        </p>
      </div>
      {showEditModal && (
        <TaskForm
          type="edit"
          name={name}
          description={description}
          dueDate={dueDate}
          status={status}
          close={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;

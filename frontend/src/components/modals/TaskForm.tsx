import { useState } from "react";
import DatePicker from "../ui/DatePicker";
import { X } from "lucide-react";
import Select from "../ui/Select";
import { STATUS } from "../home/TaskItem";

interface FormProps {
  type: "create" | "edit";
  name?: string;
  description?: string;
  dueDate?: string;
  status?: keyof typeof STATUS;
  close: () => void;
}

const options = [
  {
    label: "Ongoing",
    value: "ONGOING",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Overdue",
    value: "OVERDUE",
  },
];

const TaskForm: React.FC<FormProps> = ({
  type,
  name,
  description,
  dueDate,
  status,
  close,
}) => {
  const [taskName, setTaskName] = useState(name ?? "");
  const [date, setDate] = useState(dueDate ?? "");
  const [taskDescription, setTaskDescription] = useState(description ?? "");
  const [taskStatus, setTaskStatus] = useState(status?.toString() || "ONGOING");

  return (
    <div className="h-screen w-full bg-black/50 backdrop-blur-sm grid place-items-center fixed top-0 left-0 z-50">
      <form className="sm:w-1/2 p-4 bg-background rounded-xl relative sm:max-w-md">
        <h1 className="font-semibold text-xl text-center">
          {type === "create" ? "Create New Task" : "Edit Task"}
        </h1>
        <div className="space-y-2">
          <div className="space-y-1">
            <label htmlFor="name">Task Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="dueDate">Due Date</label>
            <DatePicker
              date={date}
              setDate={setDate}
              name="dueDate"
              id="dueDate"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="description">Task Description</label>
          <textarea
            name="description"
            id="description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <Select
            value={taskStatus.toString()}
            options={options}
            onChange={setTaskStatus}
            placeholder="Select Status"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          {type === "create" ? "Create" : "Confirm"}
        </button>
        <button
          type="button"
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.preventDefault();
            close();
          }}
        >
          <X />
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

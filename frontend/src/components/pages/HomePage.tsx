import { useState } from "react";
import TaskItem, { ITaskItem } from "../home/TaskItem";
import TaskForm from "../modals/TaskForm";
import { Plus } from "lucide-react";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const taskList: ITaskItem[] = [
    {
      id: "1",
      title: "Task 1",
      description: "do something",
      dueDate: "2024/12/12",
      status: 0,
    },
    {
      id: "2",
      title: "Task 2",
      description: "do something",
      dueDate: "2024/12/12",
      status: 1,
    },
    {
      id: "3",
      title: "Task 3",
      description: "do something",
      dueDate: "2024/12/12",
      status: 2,
    },
  ];

  return (
    <>
      <div className="">
        {taskList.map((task) => (
          <TaskItem {...task} key={task.id} />
        ))}
      </div>
      <button
        className="absolute bottom-4 right-2 size-16 rounded-full bg-primary-600 flex justify-center items-center"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        <Plus size={24} />
      </button>
      {showModal && (
        <TaskForm type="create" close={() => setShowModal(false)} />
      )}
    </>
  );
};

export default HomePage;

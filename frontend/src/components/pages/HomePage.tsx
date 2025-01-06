import { useState } from "react";
import TaskForm from "../modals/TaskForm";
import { Plus, RefreshCw } from "lucide-react";
import TaskItem from "@/components/home/TaskItem";
import useTasks from "@/hooks/useTasks";
import TaskSkeleton from "../home/TaskSkeleton";

const HomePage = () => {
  const { data, isPending, isError, isFetching } = useTasks();

  const [showModal, setShowModal] = useState(false);
  if (isPending) {
    return (
      <>
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </>
    );
  }
  if (isError) {
    return <div>some error</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {isFetching && <RefreshCw className="animate-spin size-4" />}
      </div>
      <div className="space-y-4">
        {data?.tasks.map((task) => (
          <TaskItem {...task} key={task.id} />
        ))}
      </div>
      <button
        className="fixed bottom-4 right-2 size-16 rounded-full bg-primary-600 flex justify-center items-center"
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

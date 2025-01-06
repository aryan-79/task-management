const TaskSkeleton = () => {
  return (
    <div className="h-40 w-full bg-gray-300 dark:bg-gray-900 rounded-md animate-pulse px-2 py-4 sm:px-4 grid">
      <div className="space-y-4 my-auto">
        <div className="w-24 h-4 bg-foreground-muted rounded-md"></div>
        <div className="w-full h-4 bg-foreground-muted rounded-md"></div>
        <div className="w-full h-4 bg-foreground-muted rounded-md"></div>
        <div className="w-full h-4 bg-foreground-muted rounded-md"></div>
      </div>
    </div>
  );
};

export default TaskSkeleton;

import React from 'react';

export function useTaskQueue(params: { shouldProcess: boolean }): {
  tasks: ReadonlyArray<Task>;
  isProcessing: boolean;
  addTask: (task: Task) => void;
} {
  const [queue, setQueue] = React.useState<{
    isProcessing: boolean;
    tasks: Array<Task>;
  }>({ isProcessing: false, tasks: [] });

  React.useEffect(() => {
    if (!params.shouldProcess) return;
    if (queue.tasks.length === 0) return;
    if (queue.isProcessing) return;

    console.log(queue);

    const { func, args } = queue.tasks[0];
    console.log(args);
    setQueue((prev) => ({
      isProcessing: true,
      tasks: prev.tasks.slice(1),
    }));

    Promise.resolve(func(args)).finally(() => {
      setQueue((prev) => ({
        isProcessing: false,
        tasks: prev.tasks,
      }));
    });
  }, [queue, params.shouldProcess]);

  return {
    tasks: queue.tasks,
    isProcessing: queue.isProcessing,
    addTask: React.useCallback((task) => {
      setQueue((prev) => ({
        isProcessing: prev.isProcessing,
        tasks: [...prev.tasks, task],
      }));
    }, []),
  };
}

export type Task = {
  func: (args: { [key: string]: string }) => Promise<void> | void;
  args: { [key: string]: string };
};

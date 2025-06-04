import { useEffect, useRef } from 'react';

export type Task<T> = {
  func: (args: T) => Promise<unknown>;
  args: T;
};

export type TaskQueueState = {
  isProcessing: boolean;
  tasks: Array<Task<unknown>>;
};

export function useTaskQueue(params: { shouldProcess: boolean }): {
  tasks: ReadonlyArray<Task<unknown>>;
  isProcessing: boolean;
  addTask: <T>(task: Task<T>) => void;
} {
  const queue = useRef<TaskQueueState>({ isProcessing: false, tasks: [] });

  useEffect(() => {
    if (!params.shouldProcess || queue.current.tasks.length === 0) return;
    if (queue.current.isProcessing) return;

    const { func, args } = queue.current.tasks[0];

    queue.current.isProcessing = true;

    Promise.resolve(func(args)).finally(() => {
      queue.current.isProcessing = false;
      queue.current.tasks.splice(0, 1);
    });
  }, [params.shouldProcess, queue.current.tasks.length]);

  return {
    tasks: queue.current.tasks,
    isProcessing: queue.current.isProcessing,
    addTask: (task) => queue.current.tasks.push(task as Task<unknown>),
  };
}

import React from 'react';
import { trpc } from './trpc';

export function useTaskQueue(params: { shouldProcess: boolean }): {
  tasks: ReadonlyArray<Task<unknown>>;
  isProcessing: boolean;
  addTask: <T>(task: Task<T>) => void;
} {
  const utils = trpc.useContext();
  const [queue, setQueue] = React.useState<{
    isProcessing: boolean;
    tasks: Array<Task<unknown>>;
  }>({ isProcessing: false, tasks: [] });

  React.useEffect(() => {
    if (!params.shouldProcess) return;
    if (queue.tasks.length === 0) {
      // TODO: Handle async behaviour
      utils.validator.degreeValidator.invalidate();
      utils.validator.prereqValidator.invalidate();
      return;
    }
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
        tasks: [...prev.tasks, task] as Task<unknown>[],
      }));
    }, []),
  };
}

export type Task<T> = {
  func: (args: T) => Promise<unknown>;
  args: T;
};

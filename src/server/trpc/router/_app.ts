import { router } from '../trpc';
import { userRouter } from './user';
import { templateRouter } from './template';
export const appRouter = router({
  user: userRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

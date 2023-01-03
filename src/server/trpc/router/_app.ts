import { router } from '../trpc';
import { userRouter } from './user';
import { templateRouter } from './template';
import { planRouter } from './plan';
export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

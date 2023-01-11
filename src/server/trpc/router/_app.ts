import { router } from '../trpc';
import { planRouter } from './plan';
import { templateRouter } from './template';
import { userRouter } from './user';
export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

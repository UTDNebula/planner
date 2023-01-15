import { router } from '../trpc';
import { creditsRouter } from './credits';
import { planRouter } from './plan';
import { templateRouter } from './template';
import { userRouter } from './user';
export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
  credits: creditsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

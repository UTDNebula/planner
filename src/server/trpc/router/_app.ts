import { router } from '../trpc';
import { coursesRouter } from './courses';
import { planRouter } from './plan';
import { templateRouter } from './template';
import { userRouter } from './user';
import { validatorRouter } from './validator';

export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
  courses: coursesRouter,
  validator: validatorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

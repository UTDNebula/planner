import { router } from '../trpc';
import { creditsRouter } from './credits';
import { planRouter } from './plan';
import { templateRouter } from './template';
import { userRouter } from './user';
import {coursesRouter} from './courses';

export const appRouter = router({
  user: userRouter,
  plan: planRouter,
  template: templateRouter,
  credits: creditsRouter,
  courses: coursesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

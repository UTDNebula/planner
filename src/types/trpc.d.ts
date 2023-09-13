import { type OperationContext as BaseOperationContext } from '@trpc/client';

declare module '@trpc/client' {
  interface OperationContext extends BaseOperationContext {
    skipBatch?: boolean;
  }
}

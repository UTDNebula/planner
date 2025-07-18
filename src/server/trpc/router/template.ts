import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const templateRouter = router({
  // Unprotected route
  publicGetAllTemplates: publicProcedure.query(async ({ ctx }) => {
    try {
      const templates = await ctx.prisma.template.findMany();
      return templates;
    } catch (error) {
      if (error instanceof TRPCError) {
        // TODO: Handle error and return empty template or default object
        //
        // return error;
      }
    }
  }),
  // Unprotected route
  publicGetTemplateById: publicProcedure.input(z.string().min(1)).query(async ({ ctx, input }) => {
    try {
      const template = await ctx.prisma.template.findUnique({
        where: {
          id: input,
        },
        include: {
          templateData: {
            select: {
              semester: true,
              items: {
                select: {
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });
      if (!template) {
        throw new TRPCError({
          message: 'Template not found',
          code: 'NOT_FOUND',
        });
      }
      return template;
    } catch (error) {
      console.error(error);
    }
  }),
});

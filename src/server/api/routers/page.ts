import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "src/server/api/trpc";
import { BlockTypeSchema, PropertyTypeSchema } from "prisma/generated/zod";

export const pageRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.page.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.page.findUnique({
        where: {
          id: input.id,
        },
        include: {
          properties: true,
        },
      });
    }),
  getBlocks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pageBlock.findMany({
        where: {
          pageId: input.id,
        },
      });
    }),
  editTitle: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.page.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
  addProperty: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        name: z.string(),
        type: PropertyTypeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.property.create({
        data: {
          pageId: input.pageId,
          name: input.name,
          type: input.type,
          content: null,
        },
      });
    }),

  editProperty: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.property.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
  addBlock: protectedProcedure
    .input(
      z.object({ pageId: z.string(), type: BlockTypeSchema, content: z.any() })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pageBlock.create({
        data: {
          pageId: input.pageId,
          type: input.type,
          content: input.content,
        },
      });
    }),
  editBlock: protectedProcedure
    .input(z.object({ id: z.string(), content: z.any() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pageBlock.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
  deleteBlock: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pageBlock.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

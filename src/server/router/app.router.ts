import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import {
  createNoteController,
  updateNoteController,
  deleteNoteController,
  findOneNoteController,
  findAllNotesController,
} from "../controllers/note.controller";
import {
  createNoteSchema,
  updateNoteSchema,
  params,
  paginationQuery,
} from "../validators/note.schema";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getHello: t.procedure.query((res) => {
    return { message: "Welcome to Full Stack tRPC Crud App with Nextjs." };
  }),
  createNote: t.procedure
    .input(createNoteSchema)
    .mutation(({ input }) => createNoteController({ input })),
  updateNote: t.procedure
    .input(updateNoteSchema)
    .mutation(({ input }) =>
      updateNoteController({ params: input.params, input: input.body })
    ),
  deleteNote: t.procedure
    .input(params)
    .mutation(({ input }) => deleteNoteController({ params: input })),
  getNote: t.procedure
    .input(params)
    .query(({ input }) => findOneNoteController({ params: input })),
  getNotes: t.procedure
    .input(paginationQuery)
    .query(({ input }) => findAllNotesController({ paginationQuery: input })),
});

export type AppRouter = typeof appRouter;

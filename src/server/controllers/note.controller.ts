import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  CreateNoteInput,
  UpdateNoteInput,
  ParamsInput,
  PaginationQueryInput,
} from "../validators/note.schema";
import { error } from "console";

const prisma = new PrismaClient();

// Create Note
export const createNoteController = async ({
  input,
}: {
  input: CreateNoteInput;
}) => {
  try {
    const note = await prisma.note.create({
      data: {
        title: input.title,
        content: input.content,
        category: input.category,
        published: input.published,
      },
    });

    return {
      status: "success",
      data: {
        note,
      },
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Title already exists.",
        });
      }
    }
    throw err;
  }
};

// Update Note
export const updateNoteController = async ({
  params,
  input,
}: {
  params: ParamsInput;
  input: UpdateNoteInput["body"];
}) => {
  try {
    const updateNote = await prisma.note.update({
      where: { id: params.noteId },
      data: input,
    });

    return {
      status: "success",
      note: updateNote,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Note with that title already exists.",
        });
      }
    }

    throw err;
  }
};

// Find One Note
export const findOneNoteController = async ({ params }: { params: ParamsInput }) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: params.noteId },
    });

    if (!note) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Note with the Id not found.",
      });
    }

    return {
      status: "success",
      note,
    };
  } catch (err) {
    throw err;
  }
};

// Find ALl Notes
export const findAllNotesController = async ({
  paginationQuery,
}: {
  paginationQuery: PaginationQueryInput;
}) => {
  try {
    const page = paginationQuery.page || 1;
    const limit = paginationQuery.limit || 10;
    const skip = (page - 1) * limit;

    const notes = await prisma.note.findMany({ skip, take: limit });

    return {
      status: "success",
      results: notes.length,
      notes,
    };
  } catch (err) {
    throw err;
  }
};

// Delete Note
export const deleteNoteController = async ({
  params,
}: {
  params: ParamsInput;
}) => {
  try {
    await prisma.note.delete({
      where: { id: params.noteId },
    });

    return {
      status: "success",
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if ((err.code = "P2025")) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note with that Id not found.",
        });
      }
    }
    throw err;
  }
};

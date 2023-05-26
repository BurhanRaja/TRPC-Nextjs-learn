"use client";

import React, { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { trpc } from "~/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {} from "~/server/validators/note.schema";
import { INote } from "~/type";

type IUpdateNoteProps = {
  note: INote;
  setOpenNoteModal: (open: boolean) => void;
};

const updateNoteInput = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type UpdateNoteInput = TypeOf<typeof updateNoteInput>;

const UpdateNote: FC<IUpdateNoteProps> = ({ note, setOpenNoteModal }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate: updateNote } = trpc.updateNote.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["getNotes"], { limit: 10, page: 1 }]);
      setOpenNoteModal(false);
      toast.success("Note updated successfully", {
        position: "top-right",
      });
    },
    onError: () => {
      setOpenNoteModal(false);
      toast.error("Failed to update note", {
        position: "top-right",
      });
    },
  });

  const methods = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteInput),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (note) {
      methods.reset(note);
    }
  }, []);

  const onSubmitHandler: SubmitHandler<UpdateNoteInput> = async (data) => {
    updateNote({ params: { noteId: note.id }, body: data });
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Update Note</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>{" "}
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Title
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...methods.register("title")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Content
          </label>
          <textarea
            className={twMerge(
              `appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content ? "border-red-500" : "border-gray-400"}`
            )}
            rows={6}
            {...register("content")}
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.content ? "visible" : "invisible"}`
            )}
          >
            {errors.content && errors.content.message}
          </p>
        </div>
        <button>Update Note</button>
      </form>
    </section>
  );
};

export default UpdateNote;

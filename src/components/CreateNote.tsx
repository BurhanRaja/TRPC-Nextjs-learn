import React from "react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { trpc } from "~/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoteSchema } from "~/server/validators/note.schema";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate: createNote } = trpc.createNote.useMutation({
    onSuccess() {},
    onError() {},
  });

  const methods = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
    createNote(data);
  };

  return (
    <section>
      <div className='flex justify-between items-center mb-3 pb-3 border-b border-gray-200'>
        <h2 className='text-2xl text-ct-dark-600 font-semibold'>Create Note</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className='text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer'
        >
          <i className='bx bx-x'></i>
        </div>
      </div>
      <form className='w-full' onSubmit={handleSubmit(onSubmitHandler)}>
        <div className='mb-2'>
          <label className='block text-gray-700 text-lg mb-2' htmlFor='title'>
            Title
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...register("title")}
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
        <div className='mb-2'>
          <label className='block text-gray-700 text-lg mb-2' htmlFor='title'>
            Content
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content && "border-red-500"}`
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
        <button>Create Note</button>
      </form>
    </section>
  );
};

export default CreateNote;

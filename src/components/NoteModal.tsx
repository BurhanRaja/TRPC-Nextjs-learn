"user client";

import React, { FC } from "react";

type NoteModalInput = {
  openNoteModal: boolean;
  setOpenNoteModal: (open: boolean) => void;
  children: React.ReactNode;
};

const NoteModal: FC<NoteModalInput> = ({
  openNoteModal,
  setOpenNoteModal,
  children,
}) => {
  if (!openNoteModal) return null;
  return (
    <>
      <button
        className='fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]'
        onClick={() => setOpenNoteModal(false)}
      >B</button>
      <div className='max-w-lg w-full rounded-md fixed top-[5%] xl:top-[10%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6'>
        {children}
      </div>
    </>
  );
};

export default NoteModal;

"use client";

import React from "react";
import { trpc } from "~/utils/trpc";

const Test = () => {
  const hello = trpc.getHello.useQuery();
  console.log(hello);
  return (
    <div className='max-w-lg mx-auto h-40 p-6 mt-8 text-xl font-medium rounded-sm bg-white'>
      {hello?.data?.message}
    </div>
  );
};

export default Test;

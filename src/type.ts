export type INote = {
  id: string;
  title: string;
  content: string;
  category?: string | undefined;
  published?: boolean | undefined;
  createdAt: Date;
  updatedAt: Date;
};

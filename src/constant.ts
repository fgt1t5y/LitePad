import { rest } from "./db";

export const emptyNotebook = (name: string, description: string) => ({
  name,
  description,
  ...rest(),
});

export const emptyFolder = (notebook: number, folder?: number) => ({
  notebook_id: notebook,
  folder_id: folder,
  name: "新文件夹",
  type: "folder",
  ...rest(),
});

export const emptyNote = (notebook: number, folder?: number) => ({
  notebook_id: notebook,
  folder_id: folder,
  title: "新笔记",
  type: "note",
  content: "<p></p>",
  labels: [],
  ...rest(),
});

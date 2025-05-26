import type { Folder, Note, Notebook } from "./types";

import { rest } from "./db";

export const emptyNotebook = (name: string, description: string): Notebook => ({
  name,
  description,
  ...rest(),
});

export const emptyFolder = (notebook: number, folder?: number): Folder => ({
  notebook_id: notebook,
  folder_id: folder,
  name: "新文件夹",
  type: "folder",
  ...rest(),
});

export const emptyNote = (notebook: number, folder?: number): Note => ({
  notebook_id: notebook,
  folder_id: folder,
  name: "新笔记",
  type: "note",
  content: "<p></p>",
  labels: [],
  ...rest(),
});

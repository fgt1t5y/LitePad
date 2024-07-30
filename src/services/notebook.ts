import { db } from "@/db";
import type { Notebook } from "@/types";

export const createNotebook = async (data: Notebook) => {
  return db.notebooks.add(data);
};

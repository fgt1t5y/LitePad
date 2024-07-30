import { db } from "@/db";
import type { Note } from "@/types";

export const createNote = async (data: Note) => {
  return db.notes.add(data);
};

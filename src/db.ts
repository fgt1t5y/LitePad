import Dexie, { type EntityTable } from "dexie";
import type { Notebook, Note } from "@/types";

export const db = new Dexie("LitePad_db") as Dexie & {
  notebooks: EntityTable<Notebook, "id">;
  notes: EntityTable<Note, "id">;
};

db.version(3).stores({
  notebooks:
    "++id, name, description, password, password_salt, created_at, updated_at, meta",
  notes:
    "++id, notebook_id, folder_id, note_type, title, content_type, content, preview, labels, created_at, updated_at, meta",
});

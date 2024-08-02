import Dexie, { type EntityTable } from "dexie";
import type { Notebook, Folder, Note } from "@/types";

export const db = new Dexie("LitePad_db") as Dexie & {
  notebooks: EntityTable<Notebook, "id">;
  folders: EntityTable<Folder, "id">;
  notes: EntityTable<Note, "id">;
};

db.version(3).stores({
  notebooks:
    "++id, name, description, password, password_salt, created_at, updated_at, meta",
  folders:
    "++id, notebook_id, folder_id, name, content_type, created_at, updated_at, meta",
  notes:
    "++id, notebook_id, folder_id, note_type, title, content_type, content, preview, labels, created_at, updated_at, meta",
});

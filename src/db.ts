import Dexie, { type EntityTable } from "dexie";
import type { Notebook, Folder, Note } from "@/types";

export const db = new Dexie("LitePad_db") as Dexie & {
  notebooks: EntityTable<Notebook, "id">;
  folders: EntityTable<Folder, "id">;
  notes: EntityTable<Note, "id">;
};

db.version(4).stores({
  notebooks:
    "++id, name, description, created_at, updated_at",
  folders: "++id, notebook_id, folder_id, name, type, created_at, updated_at",
  notes:
    "++id, notebook_id, folder_id, title, type, content, preview, labels, created_at, updated_at",
});

import Dexie, { type EntityTable } from "dexie";
import type { Notebook, Folder, Note } from "@/types";

export const db = new Dexie("LitePad_db") as Dexie & {
  notebooks: EntityTable<Notebook, "id">;
  folders: EntityTable<Folder, "id">;
  notes: EntityTable<Note, "id">;
};

db.version(4).stores({
  notebooks:
    "++id, name, description, password, password_salt, created_at, updated_at",
  folders: "++id, notebook_id, folder_id, name, type, created_at, updated_at",
  notes:
    "++id, notebook_id, folder_id, title, type, content, preview, labels, created_at, updated_at",
});

class FolderDB {
  constructor(data: Folder) {
    data.name = "1";
  }
}

class NoteDB {
  label: string;

  constructor(data: Note) {
    this.label = data.title;
  }
}

db.folders.mapToClass(FolderDB);
db.notes.mapToClass(NoteDB);

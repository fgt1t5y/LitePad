import Dexie from "dexie";

export const db = new Dexie("LitePad_db");

db.version(1).stores({
  users: "++id, name",
});

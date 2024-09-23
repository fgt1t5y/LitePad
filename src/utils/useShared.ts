import type { Notebook, Folder, Note, IDs } from "@/types";

import { defineStore, acceptHMRUpdate } from "pinia";

export const useShared = defineStore("shared", {
  state: () => ({
    notebooks: [] as Notebook[],
    folders: [] as Folder[],
    notes: [] as Note[],
    tree: {
      expanded: {} as IDs,
      selected: {} as IDs,
    },
    modal: {
      createNotebook: false,
    },
  }),
  actions: {
    updateFolder(id: number, data: Partial<Folder>) {
      const index = this.folders.findIndex((note) => id === note.id);
      Object.assign(this.folders[index], data);
    },
    updateNote(id: number, data: Partial<Note>) {
      const index = this.notes.findIndex((note) => id === note.id);
      Object.assign(this.notes[index], data);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShared, import.meta.hot));
}

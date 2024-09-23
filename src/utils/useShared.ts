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
    updateFolderName(id: number, name: string) {
      const index = this.folders.findIndex((note) => id === note.id);
      this.folders[index].name = name;
    },
    updateNoteName(id: number, name: string) {
      const index = this.notes.findIndex((note) => id === note.id);
      this.notes[index].name = name;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShared, import.meta.hot));
}

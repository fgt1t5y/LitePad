import type { Notebook, Folder, Note, IDs } from "@/types";

import { defineStore, acceptHMRUpdate } from "pinia";
import { useEventBus } from "@vueuse/core";

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
    panel: {
      notebookList: true,
      fileTree: true,
    },
    bus: {
      createNote: useEventBus<number | undefined>("CreateNote"),
    },
  }),
  actions: {
    updateFolder(id: number, data: Partial<Folder>) {
      const index = this.folders.findIndex((folder) => id === folder.id);
      if (index === -1) return;
      Object.assign(this.folders[index], data);
    },
    updateNote(id: number, data: Partial<Note>) {
      const index = this.notes.findIndex((note) => id === note.id);
      if (index === -1) return;
      Object.assign(this.notes[index], data);
    },

    deleteFolder(id: number) {
      const index = this.folders.findIndex((folder) => id === folder.id);
      if (index === -1) return;
      this.folders.splice(index, 1);
    },
    deleteNote(id: number) {
      const index = this.notes.findIndex((note) => id === note.id);
      if (index === -1) return;
      this.notes.splice(index, 1);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShared, import.meta.hot));
}

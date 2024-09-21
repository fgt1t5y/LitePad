import { defineStore, acceptHMRUpdate } from "pinia";

export const useShared = defineStore("shared", {
  state: () => ({
    modal: {
      createNotebook: false,
    },
  }),
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useShared, import.meta.hot));
}

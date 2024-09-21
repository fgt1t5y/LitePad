import type { Config } from "@/types";

import { defineStore, acceptHMRUpdate } from "pinia";
import { get, set } from "./helpers";

export const useConfig = defineStore("config", {
  state: () => ({
    lastNotebook: 1,
    showAsidePanel: false,
  }),
  actions: {
    load() {
      const loaded = get("config");
      if (!loaded) return;
      try {
        const parsed = JSON.parse(loaded) as Config;
        this.$patch(parsed);
      } catch (e) {
        throw new Error("Failed to parse config json.");
      }
    },
    save() {
      set("config", JSON.stringify(this.$state));
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfig, import.meta.hot));
}

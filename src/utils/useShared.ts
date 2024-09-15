import { defineStore } from "pinia";
import { ref } from "vue";
import { set, get } from "./helpers";

interface AppState {
  lastNotebook?: number;
}

export const useShared = defineStore("shared", () => {
  const modalVisible = ref({
    createNotebook: false,
  });
  const state = ref<AppState>({});

  const saveState = () => {
    set("state", JSON.stringify(state.value));
  };

  const init = () => {
    state.value = JSON.parse(get("state") || "{}") as AppState;
  };

  return { modalVisible, state, saveState, init };
});

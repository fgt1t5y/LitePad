import { defineStore } from "pinia";
import { getOrSet, set } from "@/utils/helpers";
import { computed, ref } from "vue";

type ThemeMode = "auto" | "light" | "dark";

const KEY_THEME_MODE = "LP_THEME_MOME";
const darkModeClass = "DarkMode";

export const useTheme = defineStore("theme", () => {
  const sysMedia = window.matchMedia("(prefers-color-scheme: dark)");
  let systemIsDark = sysMedia.matches;

  const currentTheme = ref<ThemeMode>(
    getOrSet(KEY_THEME_MODE, "auto") as ThemeMode
  );

  const mode = computed(() => {
    return currentTheme;
  });

  const apply = (ev?: MediaQueryListEvent) => {
    systemIsDark = ev?.matches ?? systemIsDark;
    if (
      (systemIsDark && currentTheme.value === "auto") ||
      currentTheme.value === "dark"
    ) {
      document.documentElement.classList.add(darkModeClass);
    } else {
      document.documentElement.classList.remove(darkModeClass);
    }
  };

  const init = () => {
    sysMedia.addEventListener("change", apply);
    apply();
  };

  const applyAndSava = () => {
    set(KEY_THEME_MODE, currentTheme.value);
    apply();
  };

  const switchTo = (name: ThemeMode | { value: ThemeMode }) => {
    let nextTheme = "";
    if (typeof name === "string") {
      nextTheme = name;
    } else {
      nextTheme = name.value;
    }

    currentTheme.value = nextTheme as ThemeMode;
    return applyAndSava();
  };

  return { mode, init, switchTo };
});

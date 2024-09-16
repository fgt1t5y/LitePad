import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Nora from "@primevue/themes/nora";
import { definePreset } from "@primevue/themes";
import ToastService from "primevue/toastservice";
import debounce from "debounce";

import App from "./App.vue";
import router from "./router";

import "@/styles/Default.css";
import "@/styles/Icons.css";
import "primeicons/primeicons.css";

if (window.nw) {
  const _saveWindowSize = () => {
    localStorage.setItem(
      "window_size",
      `${window.innerHeight},${window.innerWidth}`
    );
  };

  const saveWindowSize = debounce(_saveWindowSize, 200);

  const win = nw.Window.get();

  win.once("loaded", () => {
    const size = localStorage.getItem("window_size");

    if (size) {
      const [height, width] = size.split(",");

      win.resizeTo(Number(width), Number(height));
    }

    win.show();
  });

  win.on("resize", () => {
    saveWindowSize();
  });

  win.on("maximize", () => {
    saveWindowSize();
  });

  win.on("restore", () => {
    saveWindowSize();
  });
}

const DefaultPreset = definePreset(Nora, {
  semantic: {
    colorScheme: {
      light: {
        content: {
          background: "{surface.100}",
        },
      },
      dark: {
        content: {
          background: "{surface.900}",
        },
      },
    },
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: DefaultPreset,
    options: {
      darkModeSelector: ".DarkMode",
    },
  },
});
app.use(ToastService);

app.mount(document.body);

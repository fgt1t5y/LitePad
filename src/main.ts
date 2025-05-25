import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Nora from "@primevue/themes/nora";
import { definePreset } from "@primevue/themes";
import ToastService from "primevue/toastservice";

import App from "./App.vue";
import router from "./router";

import "@/styles/Default.css";
import "@/styles/Icons.css";
import "primeicons/primeicons.css";

const DefaultPreset = definePreset(Nora, {
  semantic: {
    colorScheme: {
      light: {
        content: {
          background: "{surface.100}",
        },
        text: {
          mutedColor: "{surface.400}",
        },
      },
      dark: {
        content: {
          background: "{surface.900}",
        },
        text: {
          mutedColor: "{surface.500}",
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

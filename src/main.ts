import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Nora from "@primevue/themes/nora";
import { definePreset } from "@primevue/themes";
import "@/styles/Default.css";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";

import App from "./App.vue";
import router from "./router";

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

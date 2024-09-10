import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import "@/styles/Default.css";
import "@/styles/prosemirror.css";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";

import App from "./App.vue";
import router from "./router";

const DefaultPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        content: {
          background: "{surface.100}",
          hoverBackground: "{surface.200}",
        },
        highlight: {
          focusBackground: "{primary.300}",
        },
      },
      dark: {
        content: {
          background: "{surface.900}",
        },
        highlight: {
          focusBackground: "{primary.500}",
        },
      },
    },
  },
  components: {
    contextmenu: {
      colorScheme: {
        light: {
          root: {
            background: "{surface.50}",
          },
        },
        dark: {
          root: {
            background: "{surface.950}",
          },
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

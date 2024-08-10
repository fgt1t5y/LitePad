import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import OOBEView from "@/views/OOBEView.vue";
import NoteView from "@/views/NoteView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import { has } from "@/utils/helpers";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      children: [
        {
          path: "/note/:id",
          name: "note",
          component: NoteView,
        },
        {
          path: "/",
          name: "welcome",
          component: WelcomeView,
        },
      ],
    },
    {
      path: "/_oobe",
      name: "oobe",
      component: OOBEView,
    },
  ],
});

router.beforeEach((to, from) => {
  if (!has("LP_OOBE_PASSED") && to.name !== "oobe") {
    return { name: "oobe" };
  }

  return true;
});

export default router;

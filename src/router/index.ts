import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import OOBEView from "@/views/OOBEView.vue";
import NoteView from "@/views/NoteView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import { has } from "@/utils/helpers";

const scrollPositionMap = new Map<string, number>();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to) => {
    const pageWrapper = document.getElementById("PageWrapper");
    if (!pageWrapper) return;
    const position = scrollPositionMap.get(to.fullPath);

    pageWrapper.scrollTop! = position || 0;
  },
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
  const pageWrapper = document.getElementById("PageWrapper");
  if (!pageWrapper) return;

  scrollPositionMap.set(from.fullPath, pageWrapper.scrollTop);
});

router.beforeEach((to) => {
  if (!has("LP_OOBE_PASSED") && to.name !== "oobe") {
    return { name: "oobe" };
  }

  return true;
});

export default router;

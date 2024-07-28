import { createRouter, createWebHistory } from "vue-router";
import SplashView from "@/views/SplashView.vue";
import OOBEView from "@/views/OOBEView.vue";
import { has } from "@/utils/helpers";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "splash",
      component: SplashView,
    },
    {
      path: "/_oobe",
      name: "oobe",
      component: OOBEView,
    },
  ],
});

router.beforeEach((to, from) => {
  console.log(to, from);
  if (!has("LP_OOBE_PASSED") && to.name !== "oobe") {
    return { name: "oobe" };
  }

  return true;
});

export default router;

import { createRouter, createWebHashHistory } from "vue-router";

import PageIndex from "./pages/Index.vue";
import PageScript from "./pages/Script.vue";
import PageIndex2 from "./pages/Index2.vue";

const routes = [
  {
    path: "/",
    component: PageIndex,
  },
  {
    path: "/script",
    component: PageScript,
  },
  {
    path: "/custom",
    component: PageIndex2,
  },
  {
    // fallback
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import LOCAL_STORAGE_FIELDS from "../utils/consts/localStorageFields";
import { ROUTER_PATHS, ROUTER_NAMES } from "./routerParams";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: ROUTER_PATHS.LOGIN_PAGE,
      name: ROUTER_NAMES.LOGIN_PAGE,
      component: () => import("../views/LoginPage.vue"),
    },

    {
      path: ROUTER_PATHS.MAIN_PAGE,
      name: ROUTER_NAMES.MAIN_PAGE,
      component: () => import("../views/MainPage.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: ROUTER_NAMES.MAIN_PAGE },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE_FIELDS.USER_ID);

  if (!isAuthenticated && to.name !== ROUTER_NAMES.LOGIN_PAGE) {
    next({ name: ROUTER_NAMES.LOGIN_PAGE });
  } else {
    next();
  }
});

export default router;

import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "Register" */ "../views/Register.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/",
    name: "keys-list",
    component: () =>
      import(/* webpackChunkName: "KeysList" */ "../views/KeysListPage.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/create",
    name: "create",
    component: () =>
      import(/* webpackChunkName: "Create" */ "../views/Create.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/edit/:uuid",
    name: "edit",
    component: () =>
      import(/* webpackChunkName: "Create" */ "../views/Create.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/import",
    name: "import",
    component: () =>
      import(/* webpackChunkName: "Import" */ "../views/Import.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/export",
    name: "export",
    component: () =>
      import(/* webpackChunkName: "Export" */ "../views/Export.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "Settings" */ "../views/Settings.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: process.env.IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.meta.auth) {
    if (
      window.localStorage.getItem("3splt") !== null &&
      window.localStorage.getItem("3splt") !== "undefined" &&
      window.localStorage.getItem("3splt") !== "null"
    ) {
      return next();
    } else {
      return next({ name: "register" });
    }
  }
  if (to.meta.guest) {
    if (
      window.localStorage.getItem("3splt") === null ||
      window.localStorage.getItem("3splt") === "undefined" ||
      window.localStorage.getItem("3splt") === "null"
    ) {
      return next();
    } else {
      return next(false);
    }
  }

  return next();
});

export default router;

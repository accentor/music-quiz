import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
import App from "../views/App.vue";
import Login from "../views/Login.vue";
import PlayGame from "../views/game/Play.vue";
import NewGame from "../views/game/New.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/app/",
      component: App,
      children: [
        {
          path: "game/new",
          name: "NewGame",
          component: NewGame,
        },
        {
          path: "game/play/:difficulty",
          name: "PlayGame",
          component: PlayGame,
          props: true,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        authOptional: true,
      },
    },
    { path: "/:pathMatch(.*)*", redirect: "/app/game/new" },
  ],
});

router.beforeEach((to, from, next) => {
  const onLogin = to.matched.some((record) => record.meta.authOptional);
  const authStore = useAuthStore();

  if (onLogin && authStore.loggedIn) {
    next({ name: "musicQuiz" });
  } else if (onLogin || authStore.loggedIn) {
    next();
  } else {
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router;

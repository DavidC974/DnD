import { createRouter, createWebHashHistory } from "vue-router";
import { findCharacter } from "./data/characters.js";
import CharacterPage from "./views/CharacterPage.vue";
import HomePage from "./views/HomePage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/characters/:id",
      name: "character",
      component: CharacterPage,
      beforeEnter(to) {
        return findCharacter(String(to.params.id).toLowerCase())
          ? true
          : { name: "home" };
      },
      props(route) {
        return {
          character: findCharacter(String(route.params.id).toLowerCase()),
        };
      },
    },
  ],
});

router.afterEach((to) => {
  document.title =
    to.name === "character"
      ? findCharacter(String(to.params.id).toLowerCase())?.name
      : "Feuilles de personnages";
});

export default router;

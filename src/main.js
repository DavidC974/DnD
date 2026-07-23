import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./assets/css/theme.css";
import "./assets/css/layout.css";
import "./assets/css/character-sheet/sheet.css";
import "./assets/css/character-sheet/fields.css";
import "./assets/css/character-sheet/tooltips.css";
import "./assets/css/character-sheet/toolbar.css";
import "./assets/css/character-sheet/editor.css";

createApp(App).use(router).mount("#app");

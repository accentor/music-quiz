import { createApp } from "vue";
import { createPinia } from "pinia";
import MusicQuiz from "./Main.vue";
import router from "./router";
import "./styles.css";

const pinia = createPinia();

const app = createApp(MusicQuiz).use(pinia).use(router);
app.mount("#app");

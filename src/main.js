import { createApp } from "vue";
import { createPinia } from "pinia";
import Main from "./Main.vue";
import router from "./router";
import "./styles.css";

const pinia = createPinia();

const app = createApp(Main).use(pinia).use(router);
app.mount("#app");

import { createApp } from "vue";
import Main from "./Main.vue";
import store from "./store";
import router from "./router";
import "./styles.css";

const app = createApp(Main).use(store).use(router);
app.mount("#app");

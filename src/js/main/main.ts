import { createApp } from "vue";
import App from "./main.vue";
import { createPinia } from "pinia";
import router from "../router";

const pinia = createPinia();
const myApp = createApp(App);
myApp.use(router);
myApp.use(pinia);

myApp.mount("#root");

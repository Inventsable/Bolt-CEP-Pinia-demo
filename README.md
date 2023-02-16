```js
yarn add vue-router pinia
```

## main.ts

```js
import { createApp } from "vue";
import App from "./main.vue";
import { createPinia } from "pinia";
import router from "../router";

const pinia = createPinia();
const myApp = createApp(App);
myApp.use(router);
myApp.use(pinia);

myApp.mount("#root");
```

## src/js/router/index

This doesn't need to be a .ts file, for what it's worth. TS and JS can still coexist and in cases like this where we're using reliable first party code, I keep it as JS:

```js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/main/index.html",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
  ],
});

export default router;
```

## src/js/stores/settings

A familiar but far more elegant solution than Vuex, since Pinia looks similar without the added overhead of needing actions > mutations. Here we have a setup where any time the state changes, it's written to `localStorage` immediately. Then when the panel launches, it immediately loads the `localStorage` contents and populates itself, no matter the complexity or depth of objects being worked with:

```js
import { watch } from "vue";

import { defineStore } from "pinia";
const storage = window.localStorage;

// Easier to keep track of store namespace and auto-load via variable here:
const name = "settings";
export const useSettings = defineStore(name, {
  state: () => ({
    count: 0,
  }),
  getters: {
    currentCount(state) {
      return state.count;
    },
  },
  // Actions still exist, but there are no longer mutations.
  // We can directly assign values instead, see Home.vue
  actions: {
    // We can just watch this store to auto-save and load as persistent
    // This just needs to be run once, like in App/main.vue's setup or mounted lifecycle:
    init() {
      let temp = storage.getItem(name);
      if (temp) this.$state = JSON.parse(temp);
      watch(
        this.$state,
        (state) => localStorage.setItem(name, JSON.stringify(state)),
        { deep: true }
      );
    },
  },
});
```

## main.vue

Our important hook in `setup`:

```js
const settings = useSettings();
settings.init();
```

## Home.vue

```html
<script setup lang="ts">
  import { useSettings } from "../stores/settings";

  const settings = useSettings();
  const refresh = () => location.reload();
</script>

<template>
  <!-- 
    Notice how easy it is to directly set state props, or even reset to original
    state via settings.$reset(). This is already fully persistent whereas it'd take
    far more code to do similar things in Vuex
   -->
  <button @click="settings.count++">
    {{ `Count via direct assignment: ${settings.count}` }}
  </button>
  <button @click="settings.$reset">Reset store</button>
  <button @click="refresh">Reload page</button>
</template>
```

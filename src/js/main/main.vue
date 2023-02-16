<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  subscribeBackgroundColor,
} from "../lib/utils";
import "../index.scss";

import { useSettings } from "../stores/settings";
const backgroundColor = ref("#282c34");

// Our very simple hook into making our store fully persistent
const settings = useSettings()
settings.init();

onMounted(() => {
  if (window.cep)
    subscribeBackgroundColor((c: string) => (backgroundColor.value = c));
});

</script>

<template>
  <div class="app" :style="{ backgroundColor: backgroundColor }">
    <div class="nav-bar">
      <router-link :to="{ name: 'home' }">
        Home
      </router-link>
      <router-link :to="{ name: 'about' }">
        About
      </router-link>
    </div>
    <div class="page-content">
      <RouterView />
    </div>
  </div>
</template>

<style>
.nav-bar>* {
  font-size: 32px;
  margin: 16px;
}

.page-content {
  padding-top: 16px;
  display: flex;
  flex-direction: column;
}

.page-content>*:nth-child(-n+3) {
  margin: 3px auto;
}
</style>

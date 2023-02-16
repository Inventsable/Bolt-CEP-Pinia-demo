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

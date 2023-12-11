import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    loading: false,
    branch: "development",
    currentTheme: null,
  }),

  actions: {
    setLoading(value) {
      this.$state.loading = value;
    },

    getLoading() {
      return this.$state.loading;
    },
    setBranch(branch) {
      this.$state.branch = branch;
    },

    async getBranch() {
      return this.$state.branch;
    },
  },
});

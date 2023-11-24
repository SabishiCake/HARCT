import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

export const useTaskStore = defineStore("task", {
  state: () => ({
    allTasks: [],
    task: {},
    loading: false,
    error: null,
  }),

  actions: {
    async getAllTasks() {
      try {
        await apiHandler
          .get("tasks")
          .then((response) => {
            this.allTasks = response.data;
          })
          .catch((error) => {
            this.error = error;
          });
      } catch (error) {
        this.error = error;
      }
    },
  },
});

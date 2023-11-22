import { defineStore } from "pinia";

const username = import.meta.env.VITE_APP_USERNAME;
const password = import.meta.env.VITE_APP_PASSWORD;

export const useLoginStore = defineStore("login", {
  state: () => ({
    loading: false,
    isLoggedIn: false,
    user: null,
    response: null,
  }),

  actions: {
    mockLogin(user, pass) {
      this.loading = true;

      try {
        if (user === username && pass === password) {
          this.isLoggedIn = true;
          this.user = user;
          this.response = "Login successful";
        } else {
          this.response = "Invalid credentials";
        }
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
    },
  },
});

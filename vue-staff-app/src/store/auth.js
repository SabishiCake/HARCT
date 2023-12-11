import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

export const useLoginStore = defineStore("login", {
  state: () => ({
    loading: false,
    isLoggedIn: false,
    user: null,
    response: null,
  }),

  actions: {
    // helloWorld() {
    //   console.log("Hello World!");
    // },

    async mockLogin(user, pass) {
      try {
        const req = {
          username: user,
          password: pass,
        };
        console.log("MOCK LOGIN CALLED", user, pass);

        const res = await apiHandler.post(`admin/auth`, req);

        console.log(res.status);

        if (res.status === 200) {
          this.isLoggedIn = true;
          this.user = user;
          this.response = res;
        }
      } catch (error) {
        console.log(error);
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
    },
  },
});

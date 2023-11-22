import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

export const useAccountStore = defineStore("accounts", {
  state: () => ({
    editIsReady: false,
    createIsready: false,
    loading: false,
    accounts: [],
    accountId: null,
    currentAccount: {
      guestInfo: {},
      accountInfo: {},
      room_reservations: [],
      table_Reservations: [],
      orders: [],
      payments: [],
      feedback: [],
    },
    updateResponse: null,
  }),

  actions: {
    async getAccounts() {
      this.$state.loading = true;
      try {
        const response = await apiHandler.get("guest");
        this.$state.accounts = response.data.guests;
        this.$state.loading = false;
      } catch (error) {
        console.log(error);
        this.$state.loading = false;
      }
    },

    async getAccount(id) {
      this.$state.loading = true;
      try {
        const response = await apiHandler.get(`guest/${id}`);
        this.$state.currentAccount = response.data.guestData;
        this.$state.loading = false;
      } catch (error) {
        console.log(error);
        this.$state.loading = false;
      }
    },

    async setAccountId(id) {
      this.$state.accountId = id;
    },

    async setLoading(value) {
      this.$state.loading = value;
    },

    getLoading() {
      return this.$state.loading;
    },
    getAccountId() {
      return this.$state.accountId;
    },

    getCurrentAccount() {
      return this.$state.currentAccount;
    },

    getUpdateResponse() {
      return this.$state.updateResponse;
    },

    getEditReady() {
      return this.$state.editIsReady;
    },
    getCreateReady() {
      return this.$state.createIsready;
    },
  },
});

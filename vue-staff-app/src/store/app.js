import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

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

export const usePaymentStore = defineStore("payments", {
  state: () => ({
    loading: false,
    allPayments: [],
    paymentId: null,
    refTransactionId: null,
    payment: null,
  }),

  actions: {
    async setPaymentId(id) {
      try {
        this.paymentId = id;
      } catch (error) {
        console.log(error);
      }
    },

    async setRefTransactionId(id) {
      try {
        this.refTransactionId = id;
      } catch (error) {
        console.log(error);
      }
    },

    async getPayment(id) {
      try {
        const res = apiHandler.get(`payments/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    async getPaymentByRefTransId(id) {
      try {
        const response = await apiHandler.get(`payments/refTransId/${id}`);
        console.log(response);
        this.payment = response.data;
        console.log("Store | getPaymentByRefTransId:", this.payment);
      } catch (error) {
        console.log(error);
      }
    },

    async getPayments() {
      try {
        const res = apiHandler.get(`payments`);
        if (res && res.data && Array.isArray(res.data)) {
          this.allPayments = res.data;
          console.log("Store | GET allPayments | Payments:", this.allPayments);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const useFacilityStore = defineStore("facilities", {
  state: () => ({
    loading: false,
    allFacilities: [],
    facilityId: null,
    facility: null,
  }),

  actions: {
    async getFacilities() {
      try {
        const response = await apiHandler.get("facilities");
        if (response && response.data && Array.isArray(response.data)) {
          this.allFacilities = response.data;
          console.log(
            "Store | GET allFacilities | Facilities:",
            this.allFacilities
          );
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    },

    async getFacilityById(id) {
      try {
        const response = await apiHandler.get(`facilities/${id}`);
        this.facility = response.data;
        console.log("Store | Facility:", this.facility);
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    loading: false,
    allReservations: [],
    moreReservations: [],
    reservation: null,
  }),

  actions: {
    async getAllReservations() {
      try {
        const response = await apiHandler.get("roomres");
        this.allReservations = response.data;
        console.log(
          "Store | getAllReservations | response.data: ",
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    },

    async getAllReservationsMore() {
      try {
        const response = await apiHandler.get("roomres/more");
        this.moreReservations = response.data;
        console.log(
          "Store | getAllReservationsMore | response.data: ",
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    },

    getReservationsByRoomId(id) {
      try {
        const res = this.allReservations.filter(
          (reservation) => reservation.room_id === id
        );
        console.log(res);
        this.reservation = res;
      } catch (error) {
        console.log(error);
      }
    },

    async getOccupiedRooms() {
      try {
        const response = await apiHandler.get("rooms/available");
        this.allReservations = response.data;
        console.log(
          "Store | getOccupiedRooms | response.data: ",
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    },

    async setLoading(value) {
      this.loading = value;
    },
  },
});

export const useRoomStore = defineStore("rooms", {
  state: () => ({
    loading: false,
    allRooms: [],
    allRoomTypes: [],
    roomId: null,
    availableRooms: [],
    unavailableRooms: [],
    room: null,
  }),

  actions: {
    async getRooms() {
      try {
        const response = await apiHandler.get("rooms");
        if (response && response.data && Array.isArray(response.data)) {
          this.allRooms = response.data;
          this.availableRooms = response.data.filter(
            (room) => room.is_occupied === 0
          );
          this.unavailableRooms = response.data.filter(
            (room) => room.is_occupied === 1
          );
          console.log("Store | GET allRooms | Rooms:", this.allRooms);
          // console.log("Store | Available Rooms:", this.availableRooms);
          // console.log("Store | Unavailable Rooms:", this.unavailableRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    },

    async getRoomById(id) {
      try {
        const response = await apiHandler.get(`rooms/${id}`);
        this.room = response.data;
        console.log("Store | Room:", this.room);
      } catch (error) {
        console.log(error);
      }
    },

    async getRoomTypes() {
      try {
        const response = await apiHandler.get("rooms/types");
        if (response && response.data && Array.isArray(response.data)) {
          this.allRoomTypes = response.data;
          console.log("Store | GET roomTypes | Room Types:", this.allRoomTypes);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      }
    },

    async getAvailableRooms() {
      try {
        apiHandler.get("rooms/available").then((response) => {
          this.availableRooms = response.data;
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getUnavailableRooms() {
      try {
        apiHandler.get("rooms/unavailable").then((response) => {
          this.unavailableRooms = response.data;
        });
      } catch (error) {
        console.log(error);
      }
    },

    async setLoading(value) {
      this.loading = value;
    },
  },
});

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

export const useSupplierStore = defineStore("supplier", {
  state: () => ({
    allSuppliers: [],
    supplierId: null,
    supplier: {},
  }),

  actions: {
    async getAllSuppliers() {
      try {
        await apiHandler
          .get("suppliers")
          .then((response) => {
            this.allSuppliers = response.data;
            console.log(
              "Store | getAllSuppliers | Suppliers:",
              this.allSuppliers
            );
          })
          .catch((error) => {
            this.error = error;
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
});

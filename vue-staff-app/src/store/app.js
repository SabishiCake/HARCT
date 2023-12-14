import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

export const useAppStore = defineStore("app", {
  state: () => ({
    loading: false,
    branch: "development",
  }),

  actions: {
    setbranch(branch) {
      this.branch = branch;
    },
  },
});

const getDefaultTheme = () => ({
  currentTheme: "purpleLight",
});

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  return theme ? theme : getDefaultTheme();
};

export const useThemeStore = defineStore(
  "theme",
  {
    state: () => ({
      currentTheme: getTheme(),
      useThemeSettings: false,
    }),

    actions: {
      setCurrentTheme(theme) {
        this.currentTheme = theme;
        console.log("Store | setCurrentTheme | Theme:", this.currentTheme);
        localStorage.setItem("theme", theme);
      },

      setThemeSettings(value) {
        this.useThemeSettings = value;
        console.log(
          "Store | setThemeSettings | useThemeSettings:",
          this.useThemeSettings
        );
      },
    },
  },
  { persist: true }
);

const defaultAuth = () => ({
  isLoggedIn: false,
});

const getAuth = () => {
  const auth = localStorage.getItem("auth");
  return auth ? auth : defaultAuth();
};

export const useLoginStore = defineStore("login", {
  state: () => ({
    loading: false,
    isLoggedIn: getAuth(),
    user: null,
    response: null,
  }),

  actions: {
    async login(user, pass) {
      try {
        const req = {
          username: user,
          password: pass,
        };
        console.log("MOCK LOGIN CALLED", user, pass);

        const res = await apiHandler.post(`admin/auth`, req);

        if (res.status === 200) {
          localStorage.setItem("auth", true);
          this.isLoggedIn = true;
          this.user = user;
          this.response = res;
          console.log("Store | login | Response:", this.isLoggedIn);
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

const defaultAccountId = () => ({
  accountId: null,
});

const getAccountId = () => {
  const accountId = localStorage.getItem("accountId");
  return accountId ? accountId : defaultAccountId();
};

export const useAccountStore = defineStore("accounts", {
  state: () => ({
    editIsReady: false,
    createIsready: false,
    loading: false,
    accounts: [],
    accountId: getAccountId(),
    currentAccount: {
      guestInfo: {},
      accountInfo: {},
      room_reservations: [],
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
        console.log(response);
        this.$state.accounts = response.data;
        this.$state.loading = false;
        console.log("Store | getAccounts | Accounts:", this.$state.accounts);
      } catch (error) {
        console.log(error);
        this.$state.loading = false;
      }
    },

    async getAccount(id) {
      this.$state.loading = true;
      try {
        const response = await apiHandler.get(`guest/${id}`);
        localStorage.setItem("accountId", id);
        this.$state.currentAccount = response.data.guestData;
        this.$state.loading = false;
      } catch (error) {
        console.log(error);
        this.$state.loading = false;
      }
    },

    async setAccountId(id) {
      this.$state.accountId = id;
      console.log("Store | setAccountId | Account ID:", this.$state.accountId);
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

const defaultTasks = () => ({
  allTasks: [],
});

const getTasks = () => {
  const tasks = localStorage.getItem("tasks");
  const tasksArray = JSON.parse(tasks);
  return tasksArray ? tasks : defaultTasks();
};

export const useTaskStore = defineStore("task", {
  state: () => ({
    allTasks: getTasks(),
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
            localStorage.setItem("tasks", JSON.stringify(this.allTasks));
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

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    allInventory: [],
    inventoryId: null,
    inventory: {},
  }),

  actions: {
    async getAllInventory() {
      try {
        await apiHandler
          .get("inventory")
          .then((response) => {
            this.allInventory = response.data;
            console.log(
              "Store | getAllInventory | Inventory:",
              this.allInventory
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

export const useFeedbackStore = defineStore("feedback", {
  state: () => ({
    allFeedback: [],
    feedbackId: null,
    feedback: {},
  }),

  actions: {
    async getAllFeedback() {
      try {
        await apiHandler
          .get("feedback")
          .then((response) => {
            this.allFeedback = response.data;
            console.log("Store | getAllFeedback | Feedback:", this.allFeedback);
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

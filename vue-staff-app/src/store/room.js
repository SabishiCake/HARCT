import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

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

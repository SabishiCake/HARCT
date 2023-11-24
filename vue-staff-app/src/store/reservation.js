import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

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

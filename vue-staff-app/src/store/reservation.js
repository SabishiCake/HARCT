import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    loading: false,
    allReservations: [],
    reservation: null,
  }),

  actions: {
    getAllReservations() {
      try {
        apiHandler.get("roomres").then((response) => {
          this.allReservations = response.data;
        });
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
  },
});

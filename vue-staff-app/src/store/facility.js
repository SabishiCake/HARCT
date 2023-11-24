import { defineStore } from "pinia";
import apiHandler from "@/services/apiHandler";

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

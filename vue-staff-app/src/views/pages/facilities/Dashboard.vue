<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col> <h1>Dashboard</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Information</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col>
                    <div>All Rooms:</div>
                    <div class="font-weight-bold text-uppercase">
                      {{ allRooms.length }}
                    </div>
                  </v-col>
                  <v-col>
                    <div>Available Rooms:</div>
                    <div
                      v-if="allAvailableRooms"
                      class="font-weight-bold text-uppercase"
                    >
                      {{ allAvailableRooms.length }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>
<script>
import { useFacilityStore, useRoomStore } from "@/store/app";
export default {
  name: "Dashboard",
  data: () => {
    return {
      allRooms: [],
      allAvailableRooms: [],
      allRoomTypes: [],
      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },
    };
  },

  computed: {},

  methods: {
    async getRooms() {
      try {
        const roomStore = useRoomStore();
        await roomStore.getRooms();
        await roomStore.getRoomTypes();
        this.allRooms = roomStore.allRooms;
        this.allRoomTypes = roomStore.allRoomTypes;
        console.log("allRooms", this.allRooms);
        console.log("allRoomTypes", this.allRoomTypes);
      } catch (error) {
        console.log(error);
      }
    },

    async getAvailableRooms() {
      try {
        this.allAvailableRooms = this.allRooms.filter(
          (room) => room.is_occupied === 0
        );
        console.log("allAvailableRooms", this.allAvailableRooms);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    await this.getRooms();
    this.getAvailableRooms();
  },
};
</script>

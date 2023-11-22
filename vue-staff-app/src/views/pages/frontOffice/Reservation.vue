<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col> <h1>Reservations</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="roomResSearch"
                    prepend-inner-icon="mdi-magnify "
                    label="Search"
                    single-line
                    hide-details
                    flat
                    variant="outlined"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-data-table
                :headers="resHeaders"
                :items="filteredData"
                hide-actions
                class="elevation-1"
                select-all
                pagination.sync="pagination"
                item-key="reservation_id"
                loading="true"
                search="roomResSearch"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { useReservationStore } from "@/store/reservation";
export default {
  data: () => ({
    resStore: null,
    roomResSearch: "",
    allReservations: [],
  }),

  computed: {
    resHeaders() {
      return [
        {
          title: "id",
          value: "reservation_id",
          sortable: true,
        },
        {
          title: "Room",
          value: "room_id",
          sortable: true,
        },
        {
          title: "Guest",
          value: "guest_id",
          sortable: true,
        },

        {
          title: "Check In",
          value: "check_in_date",
          sortable: true,
        },
        {
          title: "Check Out",
          value: "check_out_date",
          sortable: true,
        },
        {
          title: "total Cost",
          value: "total_cost",
          sortable: true,
        },
      ];
    },

    filteredData() {
      return this.allReservations.filter((res) => {
        return (
          res.room_id
            .toLowerCase()
            .includes(this.roomResSearch.toLowerCase()) ||
          res.check_in_date
            .toLowerCase()
            .includes(this.roomResSearch.toLowerCase()) ||
          res.check_out_date
            .toLowerCase()
            .includes(this.roomResSearch.toLowerCase()) ||
          res.total_cost
            .toLowerCase()
            .includes(this.roomResSearch.toLowerCase()) ||
          res.guest_id.toLowerCase().includes(this.roomResSearch.toLowerCase())
        );
      });
    },
  },

  methods: {
    getAllRes() {
      try {
        this.resStore.getAllReservations();
        this.allReservations = this.resStore.allReservations;
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.resStore = useReservationStore();
    this.getAllRes();
  },
};
</script>

<style></style>

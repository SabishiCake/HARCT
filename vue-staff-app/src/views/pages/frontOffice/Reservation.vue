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
            <v-container grid-list-xs dense>
              <v-row>
                <v-col cols="8">
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
                <v-col>
                  <v-row>
                    <v-col j>
                      <v-btn
                        color="primary"
                        text
                        block
                        @click="toggleOccupancy"
                        :class="toggle.occupancy ? 'red' : ''"
                      >
                        <v-icon>mdi-account</v-icon>
                        {{ toggle.occupancy ? "Unoccupied" : "All" }}
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        color="primary"
                        text
                        block
                        @click="toggleToday"
                        :class="toggle.today ? 'red' : ''"
                      >
                        <v-icon>mdi-calendar-today</v-icon>
                        {{ toggle.today ? "All" : "Today's" }}
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn color="primary" text block @click="getAllResMore">
                        <v-icon>mdi-refresh</v-icon>
                        Refresh
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col>
            <v-card>
              <v-data-table
                :headers="resHeaders"
                :items="filteredData"
                class="elevation-1"
                item-key="reservation_id"
                :rows-per-page-items="[5, 10, 15]"
              >
                <template v-slot:item.check_in_date="{ item }">
                  {{ formatDate(item.check_in_date) }}
                </template>

                <template v-slot:item.check_out_date="{ item }">
                  {{ formatDate(item.check_out_date) }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    small
                    color="primary"
                    @click="editRes(item)"
                    :key="item.reservation_id"
                    class="ma-2"
                    text
                  >
                    Edit
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col> -->

          <v-col>
            <v-card>
              <v-data-table
                :headers="resMoreHeaders"
                :items="filteredDataMore"
                class="elevation-1"
                item-key="reservation_id"
                :rows-per-page-items="[5, 10, 15]"
              >
                <template v-slot:item.check_in_date="{ item }">
                  {{ formatDate(item.check_in_date) }}
                </template>

                <template v-slot:item.check_out_date="{ item }">
                  {{ formatDate(item.check_out_date) }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="toggle.statusColor(item.status)"
                    text-color="white"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:item.room_is_occupied="{ item }">
                  <v-chip
                    :color="toggle.occupancyColor(item.room_is_occupied)"
                    text-color="white"
                  >
                    {{ item.room_is_occupied }}
                  </v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    small
                    color="primary"
                    @click="editRes(item)"
                    :key="item.reservation_id"
                    class="ma-2"
                    text
                  >
                    Edit Status
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-dialog v-model="dialog.model" max-width="500px">
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title>{{ dialog.title }} </v-toolbar-title>

            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text>
            <v-container dense>
              <v-row>
                <v-col>
                  <p>
                    <strong>Rervervation ID: </strong>

                    <span> {{ dialog.reservation.reservation_id }}</span>
                  </p>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <p>
                    <strong>Guest Name: </strong>

                    <span>
                      {{ dialog.reservation.guest_name }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>
                    <strong>Room Number: </strong>

                    <span>
                      {{ dialog.reservation.room_number }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>
                    <strong>Check In Date: </strong>

                    <span>
                      {{ formatDate(dialog.reservation.check_in_date) }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>
                    <strong>Check Out Date: </strong>

                    <span>
                      {{ formatDate(dialog.reservation.check_out_date) }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>
                    <strong>Total Cost: </strong>

                    <span>
                      {{ dialog.reservation.total_cost }}
                    </span>
                  </p>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <p>
                    <strong>Room Occupancy: </strong>

                    <span>
                      {{ dialog.reservation.room_is_occupied }}
                    </span>
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-combobox
                    v-model="dialog.reservation.status"
                    :items="['pending', 'completed', 'cancelled', 'checkedIn']"
                    label="Reservation Status"
                    outlined
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success darken-1" text @click="updateReservations"
              >Save</v-btn
            >
            <v-btn color="blue darken-1" text @click="dialog.model = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <v-snackbar
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        v-model="snackbar.model"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn :color="snackbar.btnColor" text @click="snackbar.model = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import apiHandler from "@/services/apiHandler";
import { useReservationStore } from "@/store/reservation";

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    reservationStore: null,
    roomResSearch: "",
    allReservations: [],
    AllResMore: [],
    displayedReservations: [],

    dialog: {
      model: false,
      title: "",
      reservation: null,
    },

    toggle: {
      occupancy: false,
      today: false,
      statusColor: (status) => {
        if (status === "completed") return "success";
        if (status === "checkedIn") return "success";
        if (status === "pending") return "secondary";
        if (status === "cancelled") return "error";
      },
      occupancyColor: (status) => {
        if (status === "Yes") return "success";
        if (status === "No") return "error";
      },
    },

    snackbar: {
      model: false,
      text: "",
      timeout: 2000,
      color: "",
      btnColor: "",
    },
  }),

  computed: {
    // resHeaders() {
    //   return [
    //     {
    //       title: "id",
    //       key: "reservation_id",
    //     },
    //     {
    //       title: "Room",
    //       key: "room_id",
    //     },
    //     {
    //       title: "Guest",
    //       key: "guest_id",
    //     },

    //     {
    //       title: "Check In",
    //       key: "check_in_date",
    //     },
    //     {
    //       title: "Check Out",
    //       key: "check_out_date",
    //     },
    //     {
    //       title: "total Cost",
    //       key: "total_cost",
    //     },
    //     {
    //       title: "Actions",
    //       key: "actions",
    //     },
    //   ];
    // },

    resMoreHeaders() {
      return [
        {
          title: "id",
          key: "reservation_id",
        },
        {
          title: "Room",
          key: "room_id",
        },
        {
          title: "Guest",
          key: "guest_id",
        },

        {
          title: "Guest Name",
          key: "guest_name",
        },

        {
          title: "Check In",
          key: "check_in_date",
        },
        {
          title: "Check Out",
          key: "check_out_date",
        },
        {
          title: "total Cost",
          key: "total_cost",
        },
        {
          title: "Room Number",
          key: "room_number",
        },
        {
          title: "Reservation status",
          key: "status",
        },
        {
          title: "Room Occupancy",
          key: "room_is_occupied",
        },
        {
          title: "Actions",
          key: "actions",
        },
      ];
    },

    // filteredData() {
    //   const searchTerm = this.roomResSearch.toLowerCase().trim();
    //   if (!this.reservationStore || !this.reservationStore.allReservations) {
    //     return [];
    //   }
    //   return this.reservationStore.allReservations.filter((reservation) =>
    //     Object.values(reservation).some((val) =>
    //       String(val).toLowerCase().includes(searchTerm)
    //     )
    //   );
    // },

    filteredDataMore() {
      const searchTerm = this.roomResSearch.toLowerCase().trim();
      if (!this.AllResMore) {
        return [];
      }

      return this.AllResMore.filter((reservation) => {
        const matchesSearchTerm = Object.values(reservation).some((val) =>
          String(val).toLowerCase().includes(searchTerm)
        );

        // Date filtering
        const checkInDate = new Date(
          reservation.check_in_date
        ).toLocaleDateString();
        const checkOutDate = new Date(
          reservation.check_out_date
        ).toLocaleDateString();
        const matchesDate =
          checkInDate.includes(searchTerm) || checkOutDate.includes(searchTerm);

        // Apply both text and date filters
        return matchesSearchTerm || matchesDate;
      });
    },
  },

  watch: {
    // "dialog.reservation.status": function (val) {
    //   // this.dialog.reservation.status = val;
    //   this.updateReservations();
    // },
  },

  methods: {
    async editRes(reservation) {
      this.dialog.model = true;
      this.dialog.title = "Reservation Details";
      // Create a copy of the reservation data to be edited
      this.dialog.reservation = { ...reservation };
    },

    formatDate(date) {
      const newdate = new Date(date);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const readableDate = newdate.toLocaleDateString("en-US", options);
      return readableDate;
    },

    toggleOccupancy() {
      try {
        this.toggle.occupancy = !this.toggle.occupancy;
        this.getAllResMore();
        this.snackbar.model = true;
        this.snackbar.text = `Showing ${
          this.toggle.occupancy ? "occupied" : "all"
        } rooms.`;
        this.snackbar.color = "success";
      } catch (error) {
        console.log(error);
      }
    },

    toggleToday() {
      try {
        this.toggle.today = !this.toggle.today;
        this.getAllResMore();
        this.snackbar.model = true;
        this.snackbar.text = `Showing ${
          this.toggle.today ? "today's" : "all"
        } reservations.`;
        this.snackbar.color = "success";
      } catch (error) {
        console.log(error);
      }
    },

    async refresh() {
      if (!this.reservationStore) return;

      try {
        this.reservationStore.setLoading(true); // Set loading to true
        await this.getAllResMore();
        this.snackbar.model = true;
        this.snackbar.text = "Reservations refreshed.";
        this.snackbar.color = "success";
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "An error occurred. Please try again.";
        this.snackbar.color = "error";
      } finally {
        this.reservationStore.setLoading(false);
      }
    },

    updateReservations() {
      try {
        const status = this.dialog.reservation.status.toLowerCase();
        const reservation_id = this.dialog.reservation.reservation_id;

        apiHandler
          .put(`roomres/${status}/${reservation_id}}`)
          .then((response) => {
            console.log(response);
            this.refresh();
          })
          .catch((error) => {
            console.log(error);
          });

        this.dialog.model = false;
        this.snackbar.model = true;
        this.snackbar.text = "Reservation updated.";
        this.snackbar.color = "success";
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "An error occurred. Please try again.";
        this.snackbar.color = "error";
      }
    },

    async getAllRes() {
      try {
        await this.reservationStore.getAllReservations();
        this.allReservations = this.reservationStore.allReservations;
      } catch (error) {
        console.log(error);
      }
    },

    async getAllResMore() {
      try {
        await this.reservationStore.getAllReservationsMore();
        const data = await this.reservationStore.moreReservations;
        const today = new Date().toLocaleDateString();
        // console.log("GET AllResMore DATA: ", data);

        this.AllResMore = [];

        data.forEach((item) => {
          const checkInDate = new Date(item.check_in_date).toLocaleDateString();
          if (this.toggle.occupancy && item.room.is_occupied) return;
          if (this.toggle.today && checkInDate !== today) return;
          this.AllResMore.push({
            reservation_id: item.reservation_id,
            room_id: item.room_id,
            check_in_date: item.check_in_date,
            check_out_date: item.check_out_date,
            total_cost: item.total_cost,
            guest_id: item.guest.guest_id,
            guest_name: `${item.guest.last_name}, ${item.guest.first_name}`,
            room_number: item.room.room_number,
            status: item.status,
            room_is_occupied: item.room.is_occupied ? "Yes" : "No",
          });
        });

        console.log("GET AllResMore: ", this.AllResMore);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.reservationStore = useReservationStore();
    await this.getAllRes();
    await this.getAllResMore();
  },
};
</script>

<style></style>

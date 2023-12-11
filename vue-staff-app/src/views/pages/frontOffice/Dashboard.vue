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
      <v-container>
        <!-- <v-row>
          <v-col>
            <v-alert
              v-model="toggle.isToday"
              border="left"
              color="primary"
              variant="outlined"
              closable
              close-label="Close Alert"
              title="Notice"
            >
              Data is automatically refreshed every 5 seconds.
            </v-alert>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Information</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-container grid-list-xs dense no-gutters>
                  <v-row>
                    <v-col>
                      <v-container grid-list-xs dense no-gutters>
                        <v-row>
                          <v-col>
                            <div>Today's Total Reservations:</div>
                            <div class="font-weight-bold text-uppercase">
                              {{
                                filteredPendingReservations.filter((res) => {
                                  return res.status === "pending";
                                }).length
                              }}
                            </div>
                          </v-col>
                          <v-col>
                            <div>Today's Total Bookings:</div>
                            <div class="font-weight-bold text-uppercase">
                              {{
                                filteredPendingBookings.filter((res) => {
                                  return res.status === "pending";
                                }).length
                              }}
                            </div>
                          </v-col>
                          <v-col>
                            <div>Today's Total:</div>
                            <div class="font-weight-bold text-uppercase">
                              {{
                                allPendingToday.filter((res) => {
                                  return res.status === "pending";
                                }).length
                              }}
                            </div>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card min-height="100px">
              <v-toolbar color="primary">
                <v-toolbar-title>Today's Pending </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                    <v-tooltip bottom activator="parent"> Refresh </v-tooltip>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="allPendingToday.length === 0">
                    <v-card-text>
                      <div class="font-weight-bold text-uppercase">
                        No Reservations or Bookings for Today
                      </div>
                    </v-card-text>
                  </v-col>

                  <v-col
                    v-for="(reservation, index) in allPendingToday"
                    :key="index"
                    cols="auto"
                    sm="6"
                    md="4"
                  >
                    <v-card>
                      <v-toolbar :color="card.color(reservation.type)">
                        <v-toolbar-title>
                          <span class="font-weight-bold text-uppercase">{{
                            reservation.guest_name
                          }}</span>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items> </v-toolbar-items>
                      </v-toolbar>

                      <v-card-text>
                        <div>
                          Room: {{ reservation.room_number }}
                          <v-chip
                            color="green"
                            text-color="white"
                            v-if="reservation.room_is_occupied === 'Yes'"
                          >
                            <v-icon>mdi-check</v-icon>
                            {{ reservation.room_is_occupied }}
                          </v-chip>
                        </div>
                        <div>
                          Check-in:
                          {{ this.formatDate(reservation.check_in_date) }}
                        </div>
                        <div>
                          Check-out:
                          {{ this.formatDate(reservation.check_out_date) }}
                        </div>
                        <div>Total Cost: {{ reservation.total_cost }}</div>
                        <div>
                          Status:
                          <v-chip
                            color="warning"
                            text-color="white"
                            v-if="reservation.status === 'pending'"
                          >
                            {{ reservation.status }}
                          </v-chip>
                        </div>
                        <div>
                          Type:
                          <v-chip
                            color="primary"
                            text-color="white"
                            v-if="reservation.type === 'reservation'"
                          >
                            {{ reservation.type }}
                          </v-chip>
                          <v-chip
                            color="secondary"
                            text-color="white"
                            v-if="reservation.type === 'booking'"
                          >
                            {{ reservation.type }}
                          </v-chip>
                        </div>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                          color="primary"
                          text
                          @click="editReservation(reservation)"
                          block
                        >
                          <v-icon>mdi-pencil</v-icon>
                          Edit Status
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-dialog v-model="dialog.model" max-width="500px">
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon @click="dialog.model = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="dialog.item.guest_name"
                label="Guest Name"
                required
                readonly
              ></v-text-field>
              <v-text-field
                v-model="dialog.item.room_number"
                label="Room Number"
                required
                readonly
              ></v-text-field>
              <v-text-field
                v-model="dialog.item.check_in_date"
                label="Check-in Date"
                required
                readonly
              ></v-text-field>
              <v-text-field
                v-model="dialog.item.check_out_date"
                label="Check-out Date"
                required
                readonly
              ></v-text-field>
              <v-text-field
                v-model="dialog.item.total_cost"
                label="Total Cost"
                required
                readonly
              ></v-text-field>
              <v-text-field
                v-model="dialog.item.status"
                label="Status"
                required
                readonly
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn color="success" text @click="checkInReservation" block>
                <v-icon>mdi-check</v-icon>
                Check In
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <v-dialog
        v-model="paymentDialog.model"
        max-width="500px"
        persistent
        @keydown.esc="paymentDialog.model = false"
      >
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
          <v-btn color="white" text @click="snackbar.model = false"
            >Close</v-btn
          >
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { useReservationStore } from "@/store/reservation";
import apiHandler from "@/services/apiHandler";
export default {
  data() {
    return {
      useResStore: null,
      allPendingRes: [],
      allPendingToday: [],
      pendingReservations: [],
      pendingBookings: [],

      card: {
        title: "",
        text: "",
        arrayLimit: 0,
        color: (type) => {
          if (type === "reservation") return "primary";
          if (type === "booking") return "secondary";
        },
      },

      dialog: {
        item: null,
        model: false,
        title: "",
        text: "",
      },

      paymentDialog: {
        item: null,
        model: false,
        title: "",
        text: "",
      },

      toggle: {
        isToday: true,
      },

      snackbar: {
        model: false,
        text: "",
        color: "",
        timeout: 3000,
        btnColor: "",
      },
    };
  },

  computed: {
    autoRefreshTimer() {
      setInterval(() => {
        this.refresh();
      }, 5000);
    },

    filteredPendingBookings() {
      const today = new Date().toLocaleDateString();
      return this.allPendingRes.filter((res) => {
        const checkInDate = new Date(res.check_in_date).toLocaleDateString();
        const status = res.status;
        if (this.toggle.isToday && checkInDate !== today) return;
        if (this.toggle.isToday && status !== "pending") return;
        return res.type === "booking";
      });
    },

    filteredPendingReservations() {
      const today = new Date().toLocaleDateString();
      return this.allPendingRes.filter((res) => {
        const checkInDate = new Date(res.check_in_date).toLocaleDateString();
        const status = res.status;
        if (this.toggle.isToday && checkInDate !== today) return;
        if (this.toggle.isToday && status !== "pending") return;
        return res.type === "reservation";
      });
    },
  },

  methods: {
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

    editReservation(reservation) {
      try {
        this.dialog.model = true;
        this.dialog.title = "Edit Reservation";
        this.dialog.text = "Edit Reservation";
        this.dialog.item = reservation;
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error;
        this.snackbar.color = "error";
        this.snackbar.btnColor = "error";
      }
    },

    refresh() {
      try {
        this.allPendingRes = [];
        this.allPendingToday = [];
        this.getAllReservations();
        this.snackbar.model = true;
        this.snackbar.text = "Refreshed";
        this.snackbar.color = "success";
        this.snackbar.btnColor = "success";
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error;
        this.snackbar.color = "error";
        this.snackbar.btnColor = "error";
      }
    },

    async checkInReservation() {
      try {
        if (!confirm("Are you sure you want to check in this reservation?"))
          return;

        const reservation = this.dialog.item;
        const reservation_id = reservation.reservation_id;

        await apiHandler
          .put(`roomres/checkedin/${reservation_id}`)
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            console.log("err", err);
          });

        this.refresh();

        this.snackbar.model = true;
        this.snackbar.text = "Reservation Checked In";
        this.snackbar.color = "success";
        this.snackbar.btnColor = "success";
        this.dialog.model = false;
        await this.getAllReservations();
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error;
        this.snackbar.color = "error";
        this.snackbar.btnColor = "error";
      }
    },

    async getAllReservations() {
      try {
        await this.useResStore.getAllReservationsMore();
        const allPendingRes = this.useResStore.moreReservations;
        this.allPendingRes = allPendingRes;
        if (allPendingRes.length === 0) {
          this.snackbar.model = true;
          this.snackbar.text = "No Reservations or Bookings";
          this.snackbar.color = "error";
          this.snackbar.btnColor = "error";
          return;
        }
        console.log("allResMore", allPendingRes);
        const today = new Date().toLocaleDateString();

        allPendingRes.forEach((item) => {
          const checkInDate = new Date(item.check_in_date).toLocaleDateString();
          const status = item.status;
          if (this.toggle.isToday && checkInDate !== today) return;
          if (this.toggle.isToday && status !== "pending") return;
          this.allPendingToday.push({
            reservation_id: item.reservation_id,
            room_id: item.room_id,
            check_in_date: item.check_in_date,
            check_out_date: item.check_out_date,
            total_cost: item.total_cost,
            guest_id: item.guest.guest_id,
            guest_name: `${item.guest.last_name}, ${item.guest.first_name}`,
            room_number: item.room.room_number,
            status: item.status,
            type: item.type,
            room_is_occupied: item.room.is_occupied ? "Yes" : "No",
          });
        });
        console.log("allPendingToday", this.allPendingToday);
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error;
        this.snackbar.color = "error";
        this.snackbar.btnColor = "error";
      }
    },
  },

  async mounted() {
    this.useResStore = useReservationStore();
    await this.getAllReservations();
  },
};
</script>

<style></style>

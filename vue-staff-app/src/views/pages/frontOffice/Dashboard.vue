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
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Reservations</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-card-text>
                <!-- <div class="font-weight-bold text-uppercase">
                  Today: {{ allResToday.length }}
                </div>
                <div class="font-weight-bold text-uppercase">
                  More: {{ filteredReservations.length }}
                </div> -->

                <v-row>
                  <v-col>
                    <v-card>
                      <v-card-title>
                        <div class="font-weight-bold text-uppercase">
                          Today: {{ allResToday.length }}
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card>
                      <v-card-title>
                        <div class="font-weight-bold text-uppercase">
                          More: {{ filteredReservations.length }}
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-col>
                  <!-- <v-col>
                    <v-card>
                      <v-card-title>
                        <div class="font-weight-bold text-uppercase">
                          Total: {{ allResMore.length }}
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-col> -->
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card min-height="100px">
              <v-toolbar color="primary">
                <v-toolbar-title>Todays Pending Reservations</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-col v-if="allResToday.length === 0">
                <v-card-text>
                  <div class="font-weight-bold text-uppercase">
                    No Reservations Today
                  </div>
                </v-card-text>
              </v-col>

              <v-col
                v-for="(reservation, index) in allResToday"
                :key="index"
                cols="auto"
                sm="6"
                md="4"
              >
                <v-card>
                  <v-toolbar color="secondary">
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
                      Check-in: {{ this.formatDate(reservation.check_in_date) }}
                    </div>
                    <div>
                      Check-out:
                      {{ this.formatDate(reservation.check_out_date) }}
                    </div>
                    <div>Total Cost: {{ reservation.total_cost }}</div>
                    <div>
                      Status:
                      <v-chip
                        color="secondary"
                        text-color="white"
                        v-if="reservation.status === 'pending'"
                      >
                        {{ reservation.status }}
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
import { useReservationStore } from "@/store/reservation";
import apiHandler from "@/services/apiHandler";
export default {
  data() {
    return {
      useResStore: null,
      allResMore: [],
      allResToday: [],

      card: {
        title: "",
        text: "",
        arrayLimit: 0,
      },

      dialog: {
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
    filteredReservations() {
      return this.allResMore.filter((res) => {
        return res.status === "pending";
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
        this.allResMore = [];
        this.allResToday = [];
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
        const allResMore = this.useResStore.moreReservations;
        this.allResMore = allResMore;
        console.log("allResMore", allResMore);
        const today = new Date().toLocaleDateString();

        allResMore.forEach((item) => {
          const checkInDate = new Date(item.check_in_date).toLocaleDateString();
          const status = item.status;
          if (this.toggle.isToday && checkInDate !== today) return;
          if (this.toggle.isToday && status !== "pending") return;
          this.allResToday.push({
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

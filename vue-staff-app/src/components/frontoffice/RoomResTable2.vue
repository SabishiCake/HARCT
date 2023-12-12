<template>
  <div>
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>
          <v-icon>mdi-calendar</v-icon>
          Room Reservations And Bookings
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-xs>
          <v-row v-if="defaultItem.reservation_id">
            <v-col>
              <v-card>
                <v-card-text>
                  <span v-if="defaultItem.reservation_id">
                    Editing Reservation With ID:
                    <v-chip close color="primary" text-color="primary">
                      <v-avatar>
                        <v-icon>mdi-calendar</v-icon>
                      </v-avatar>
                      {{ defaultItem.reservation_id }}
                    </v-chip>
                  </span>
                  <v-divider vertical></v-divider>
                  <span v-if="defaultItem.room_id">
                    Former Room ID:
                    <v-chip close color="secondary" text-color="primary">
                      {{ defaultItem.room_id }}
                    </v-chip>
                  </span>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-form>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col>
                      <!-- <v-combobox
                        label="Room"
                        v-model="selectedRoom"
                        :items="availableRooms.items"
                        item-title="room_id"
                        item-text="room_id"
                        return-object
                      >
                      </v-combobox> -->
                      <v-select
                        label="Room"
                        v-model="selectedRoom"
                        :items="availableRooms.items"
                        item-title="room_id"
                        item-text="room_id"
                        return-object
                      >
                      </v-select>
                    </v-col>
                    <v-col>
                      <v-select
                        label="Type"
                        v-model="editedItem.type"
                        :items="['reservation', 'booking']"
                        return-object
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Room type"
                        v-model="room.type"
                        readonly
                      >
                      </v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Room rate"
                        v-model="room.rate"
                        readonly
                      >
                      </v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        label="Room number"
                        v-model="room.number"
                        readonly
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <h6>Chek-In Date</h6>
                      <VueDatePicker
                        v-model="editedItem.check_in_date"
                        label="Check-In Date"
                        text-input
                      >
                      </VueDatePicker>
                    </v-col>
                    <v-col>
                      <h6>Chek-Out Date</h6>
                      <VueDatePicker
                        v-model="editedItem.check_out_date"
                        label="Check-Out Date"
                        text-input
                      ></VueDatePicker>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.total_cost"
                        label="Total Cost = no. of days * room rate"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <!-- <v-combobox
                        v-model="editedItem.status"
                        :items="[
                          'pending',
                          'completed',
                          'cancelled',
                          'checkedIn',
                        ]"
                        label="Status"
                        return-object
                      >
                      </v-combobox> -->
                      <v-select
                        v-model="editedItem.status"
                        :items="[
                          'pending',
                          'completed',
                          'cancelled',
                          'checkedIn',
                        ]"
                        label="Status"
                        readonly
                        return-object
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn
                color="primary"
                @click="updateOrAddReservation"
                :disabled="!isNewItem"
                block
              >
                Add New
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                color="primary"
                @click="updateOrAddReservation"
                :disabled="isNewItem"
                block
              >
                Update
              </v-btn>
            </v-col>

            <v-col>
              <v-btn color="error" @click="undo" :disabled="isNewItem" block>
                Undo
              </v-btn>
            </v-col>

            <v-col>
              <v-btn
                color="error"
                @click="emptyFields"
                :disabled="isNewItem ? true : false"
                block
              >
                Empty Fields
              </v-btn>
            </v-col>
          </v-row>

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
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn color="primary" height="50px" @click="refresh" block>
                Refresh
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-data-table
                :headers="roomResHeaders"
                :items="filteredData"
                class="elevation-2"
              >
                <template v-slot:item.check_in_date="{ item }">
                  {{ formatDate(item.check_in_date) }}
                </template>

                <template v-slot:item.check_out_date="{ item }">
                  {{ formatDate(item.check_out_date) }}
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip :color="toggle.statusColor(item.status)" dark small>{{
                    item.status
                  }}</v-chip>
                </template>

                <template v-slot:item.type="{ item }">
                  <v-chip :color="toggle.typeColor(item.type)" dark small>{{
                    item.type
                  }}</v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-icon
                    size="small"
                    class="me-2"
                    color="primary"
                    @click="editReservation(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    size="small"
                    color="error"
                    @click="deleteReservation(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
  <div>
    <v-snackbar
      v-model="snackbar.model"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <v-btn
        flat
        :color="snackbar.btnColor"
        @click.native="snackbar.model = false"
        >Close</v-btn
      >
    </v-snackbar>
  </div>
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { useAccountStore } from "@/store/app";
import { useRoomStore } from "@/store/app";

import apihandler from "@/services/apiHandler";

export default {
  emits: ["data-changed"],
  props: {
    data: {
      type: Array,
      required: true,
    },
    guest_id: {
      type: String,
      required: true,
    },
  },
  components: {
    VueDatePicker,
  },

  data() {
    return {
      isNewItem: true,
      roomResSearch: "",
      editedIndex: -1,
      snackbar: {
        model: false,
        text: "",
        color: "",
        timeout: 3000,
        btnColor: "",
      },

      toggle: {
        statusColor: (status) => {
          if (status === "completed") return "success";
          if (status === "checkedIn") return "success";
          if (status === "pending") return "secondary";
          if (status === "cancelled") return "error";
        },
        typeColor: (type) => {
          if (type === "room_reservation") return "primary";
          if (type === "room_booking") return "secondary";
        },
      },

      selectedRoom: null,
      selectedType: null,

      editedItem: {
        reservation_id: "",
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
        status: "",
        type: "",
      },
      defaultItem: {
        reservation_id: "",
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
        status: "",
        type: "",
      },

      roomStore: null,
      availableRooms: {
        value: null,
        items: [],
      },
      unavailableRooms: [],

      room: {
        number: "",
        type: "",
        rate: "",
      },
    };
  },

  watch: {
    async selectedRoom() {
      try {
        if (this.selectedRoom) {
          console.log("Res | Selected Room: ", this.selectedRoom);
          this.updateRoomId();
          this.getRoomType();
          this.getTotalCost();
        }
      } catch (error) {
        console.log(error);
      }
    },

    "editedItem.type": function () {
      console.log("Res | Type: ", this.editedItem.type);
    },

    "editedItem.check_in_date": function () {
      console.log("Res | Check In Date: ", this.editedItem.check_in_date);
      this.getTotalCost();
    },

    "editedItem.check_out_date": function () {
      console.log("Res | Check Out Date: ", this.editedItem.check_out_date);
      this.getTotalCost();
    },
  },

  computed: {
    async accountResData() {
      const accountStore = useAccountStore();
      const account = await accountStore.getAccountId(this.id);
      return account.room_reservations;
    },

    roomResHeaders() {
      return [
        { title: "Res ID", value: "reservation_id" },
        { title: "Room ID", value: "room_id" },
        { title: "Check-In Date", value: "check_in_date" },
        { title: "Check-Out Date", value: "check_out_date" },
        { title: "Total Cost", value: "total_cost" },
        { title: "Status", value: "status" },
        { title: "Type", value: "type" },
        { title: "Actions", value: "actions", sortable: false },
      ];
    },

    filteredData() {
      console.log("Res | Filtered Data: ", this.data);
      return this.data.filter((item) => {
        return Object.keys(item).some((key) =>
          String(item[key])
            .toLowerCase()
            .includes(this.roomResSearch.toLowerCase())
        );
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
        // hour: "numeric",
        // minute: "numeric",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const readableDate = newdate.toLocaleDateString("en-US", options);
      return readableDate;
    },

    refresh() {
      this.emptyFields();
      this.getAvailableRooms();
      this.getAllRooms();
      this.$emit("data-changed");
    },

    initialData() {
      const item = 0;
      try {
        if (this.data[item]) {
          console.log("Res | Initial Data: ", this.data[item]);
          this.editedItem = Object.assign({}, this.data[item]);
          this.defaultItem = Object.assign({}, this.data[item]);
          this.isNewItem = false;

          this.updateRoomId();
          this.getRoomType();
          this.getTotalCost();
        }
      } catch (error) {
        console.log(error);
      }
    },

    initTimeAndDate() {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      const dateTime = `${date} ${time}`;
      const initDate = new Date(dateTime);
      console.log("Res | Init Date: ", initDate);
      this.editedItem.check_in_date = initDate;
      this.editedItem.check_out_date = initDate;
    },

    async getAllRooms() {
      try {
        await this.roomStore.getRooms();
        this.rooms = this.roomStore.allRooms;
      } catch (error) {
        console.log(error);
      }
    },

    updateRoomId() {
      try {
        if (this.selectedRoom) {
          console.log("Res | Update Room ID: ", this.selectedRoom.room_id);
          this.editedItem.room_id = this.selectedRoom.room_id;
        }
      } catch (error) {
        console.log(error);
      }
    },

    undoRoomId() {
      try {
        this.editedItem.room_id = this.defaultItem.room_id;
        this.selectedRoom = null;
      } catch (error) {
        console.log(error);
      }
    },

    getRoomType() {
      try {
        const id = this.editedItem.room_id;
        console.log("Res | GET Room Type ID: ", id);
        console.log("Res | GET Room : ", this.roomStore.allRooms);
        const roomData = this.roomStore.allRooms;

        roomData.forEach((item) => {
          // console.log("Res | GET Room Type Item: ", item.room_id);
          console.log("Res | GET Room Type Item Id: ", id);
          if (item.room_id === id) {
            console.log("Res | GET Room Type Item: ", item.type.type_name);

            this.room.type = item.type.type_name;
            this.room.rate = item.type.rate;
            this.room.number = item.room_number;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    getAvailableRooms() {
      try {
        this.availableRooms.items = this.roomStore.availableRooms;
        console.log("Res | GET Available Rooms: ", this.availableRooms.items);
      } catch (error) {
        console.log(error);
      }
    },

    validate() {
      try {
        if (
          this.editedItem.room_id &&
          this.editedItem.check_in_date &&
          this.editedItem.check_out_date &&
          this.editedItem.total_cost
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    updateOrAddReservation() {
      try {
        if (this.isNewItem) {
          this.addReservation();
        } else {
          this.updateReservation();
        }
      } catch (error) {
        console.log(error);
      }
    },

    addReservation() {
      try {
        if (!confirm("Are you sure you want to add this reservation?")) return;

        if (!this.validate()) {
          this.snackbar.model = true;
          this.snackbar.text = "Please fill all the fields";
          this.snackbar.color = "error";
          this.snackbar.btnColor = "error";
          return;
        }
        const data = {
          GuestID: this.guest_id,
          RoomID: this.editedItem.room_id,
          CheckInDate: this.editedItem.check_in_date,
          CheckOutDate: this.editedItem.check_out_date,
          TotalCost: this.editedItem.total_cost,
          Type: this.editedItem.type,
        };

        apihandler
          .post("roomres", data)
          .then((response) => {
            if (response.status === 200) {
              console.log("Res | Add Response: ", response);

              this.snackbar.model = true;
              this.snackbar.text = response.data.message;
              this.snackbar.color = "success";
              this.snackbar.btnColor = "success";
              this.refresh();
            } else {
              this.snackbar.model = true;
              this.snackbar.text = response.data.error || "Conflicting Data. ";

              this.snackbar.color = "error";
              this.snackbar.btnColor = "error";
            }
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = error.message || error.response.data.message;
            this.snackbar.color = "error";
            this.snackbar.btnColor = "error";
          });
      } catch (error) {
        console.log(error);
      }
    },

    updateReservation() {
      try {
        if (!confirm("Are you sure you want to update this reservation?"))
          return;
        // const status = this.editedItem.status;
        const resId = this.editedItem.reservation_id;
        const check_in_date = new Date(this.editedItem.check_in_date);
        const check_out_date = new Date(this.editedItem.check_out_date);

        console.log("Res | Update Reservation: ", check_in_date);

        // console.log("Res | Update Reservation: ", this.editedItem);

        const data = {
          GuestID: this.editedItem.guest_id,
          RoomID: this.editedItem.room_id,
          CheckInDate: check_in_date,
          CheckOutDate: this.editedItem.check_out_date,
          TotalCost: this.editedItem.total_cost,
          Status: this.editedItem.status,
          Type: this.editedItem.type,
        };

        apihandler
          .put(`roomres/${resId}`, data)
          .then((response) => {
            if (response.status === 200) {
              console.log("Res | Update Response: ", response);

              this.snackbar.model = true;
              this.snackbar.text = response.data.message;
              this.snackbar.color = "success";
              this.snackbar.btnColor = "success";
              this.refresh();
            } else {
              console.log("Res | Update Response: ", response);

              this.snackbar.model = true;
              this.snackbar.text = response.data.error || "Conflicting Data. ";
              this.snackbar.color = "error";
              this.snackbar.btnColor = "error";
            }
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = error.message || "Something went wrong.";
            this.snackbar.color = "error";
            this.snackbar.btnColor = "error";
          });
      } catch (error) {
        console.log(error);
      }
    },

    editReservation(item) {
      try {
        this.editedIndex = this.data.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.defaultItem = Object.assign({}, item);

        this.selectedRoom = {
          room_id: item.room_id,
        };
        this.updateRoomId();
        this.getRoomType();
        this.getTotalCost();
        this.isNewItem = false;
      } catch (error) {
        console.log(error);
      }
    },

    deleteReservation(item) {
      try {
        if (!confirm("Are you sure you want to delete this reservation?"))
          return;
        const id = item.reservation_id;
        apihandler.delete(`roomres/${id}`).then((response) => {
          console.log("Res | Delete Response: ", response);
          this.snackbar.model = true;
          this.snackbar.text = "Reservation Deleted Successfully";
          this.snackbar.color = "success";
          this.snackbar.btnColor = "success";
          this.refresh();
        });
      } catch (error) {
        console.log(error);
      }
    },

    undo() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.undoRoomId();
      this.getRoomType();
      this.getTotalCost();
      this.editedIndex = -1;
      this.isNewItem = false;
    },

    emptyFields() {
      this.editedItem = {
        reservation_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
      };
      this.room = {
        number: "",
        type: "",
        rate: "",
      };
      this.selectedRoom = null;

      this.isNewItem = true;
    },

    getTotalCost() {
      try {
        // formula: Total Cost = no. of days * room rate
        const checkInDate = new Date(this.editedItem.check_in_date);
        const checkOutDate = new Date(this.editedItem.check_out_date);

        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const totalCost = diffDays * this.room.rate;
        this.editedItem.total_cost = totalCost;

        console.log("Res | Total Cost: ", totalCost);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    this.roomStore = useRoomStore();
    this.initialData();
    this.getAllRooms();
    this.getAvailableRooms();
    this.initTimeAndDate();
  },
};
</script>

<style scoped></style>

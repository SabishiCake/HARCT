<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <v-container grid-list-xs>
          <v-row>
            <v-col>
              <v-icon icon="mdi-calendar"></v-icon>
              Room Reservations
              <span v-if="defaultItem.reservation_id"
                >| Editing Reservation With ID: {{ defaultItem.reservation_id }}
              </span>
              <span v-if="defaultItem.room_id">
                and former Room ID:
                {{ defaultItem.room_id }}
              </span>
              <v-spacer></v-spacer>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-form>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col>
                      <v-combobox
                        label="Room"
                        v-model="selectedRoom"
                        :items="availableRooms.items"
                        item-title="room_id"
                        item-text="room_id"
                        return-object
                      >
                      </v-combobox>
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
                      <v-combobox
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
                      </v-combobox>
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
      </v-card-title>
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

import { useAccountStore } from "@/store/account";
import { useRoomStore } from "@/store/room";

import apihandler from "@/services/apiHandler";

export default {
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
      },

      selectedRoom: null,

      editedItem: {
        reservation_id: "",
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
        status: "",
      },
      defaultItem: {
        reservation_id: "",
        guest_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
        status: "",
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
        { title: "Actions", value: "actions", sortable: false },
      ];
    },

    filteredData() {
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
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const readableDate = newdate.toLocaleDateString("en-US", options);
      return readableDate;
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
        };

        apihandler.post("roomres", data).then((response) => {
          console.log("Res | Add Response: ", response);

          this.refresh();
        });
        this.snackbar.model = true;
        this.snackbar.text = "Reservation Added Successfully";
        this.snackbar.color = "success";
        this.snackbar.btnColor = "success";
      } catch (error) {
        console.log(error);
      }
    },

    updateReservation() {
      try {
        if (!confirm("Are you sure you want to update this reservation?"))
          return;
        const status = this.editedItem.status;
        const resId = this.editedItem.reservation_id;
        const data = {
          GuestID: this.editedItem.guest_id,
          RoomID: this.editedItem.room_id,
          CheckInDate: this.editedItem.check_in_date,
          CheckOutDate: this.editedItem.check_out_date,
          TotalCost: this.editedItem.total_cost,
        };

        apihandler
          .put(`roomres/${this.editedItem.reservation_id}`, data)
          .then((response) => {
            console.log("Res | Update Response: ", response);

            this.refresh();
          });
        this.snackbar.model = true;
        this.snackbar.text = "Reservation Updated Successfully";
        this.snackbar.color = "success";
        this.snackbar.btnColor = "success";

        apihandler.put(`roomres/${status}/${resId}`).then((response) => {
          console.log("Res | Update Response: ", response);

          this.refresh();
        });

        // apihandler
        //   .put(`room/unOccupy/${this.defaultItem.room_id}`)
        //   .then((response) => {
        //     console.log("Res | Update Response: ", response);
        //     this.snackbar.model = true;
        //     this.snackbar.text = "Room Unoccupied Successfully";
        //     this.snackbar.color = "success";
        //     this.snackbar.btnColor = "success";
        //     this.refresh();
        //   });
      } catch (error) {
        console.log(error);
      }
    },

    editReservation(item) {
      try {
        this.editedIndex = this.data.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.defaultItem = Object.assign({}, item);
        this.updateRoomId();
        this.getRoomType();
        this.getTotalCost();
        this.isNewItem = false;
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

    refresh() {
      this.emptyFields();
      this.getAvailableRooms();
      this.getAllRooms();
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

  async mounted() {
    this.roomStore = useRoomStore();
    this.initialData();
    this.getAllRooms();
    this.getAvailableRooms();
  },
};
</script>

<style scoped></style>

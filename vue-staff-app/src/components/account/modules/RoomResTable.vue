<template>
  <v-card>
    <v-card-title primary-title>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-icon icon="mdi-calendar"></v-icon>
            Room Reservations
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
                      v-model="editedItem.room_id"
                      :items="availableRooms.items"
                      item-title="room_id"
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
                    ></VueDatePicker>
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
                      label="Total Cost"
                      readonly
                    ></v-text-field>
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
                {{ formatDateForPicker(item.check_in_date) }}
              </template>

              <template v-slot:item.check_out_date="{ item }">
                {{ formatDateForPicker(item.check_out_date) }}
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
</template>

<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAccountStore } from "@/store/account";
import { useRoomStore } from "@/store/room";

export default {
  props: {
    data: {
      type: Array,
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

      editedItem: {
        reservation_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
      },
      defaultItem: {
        reservation_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_cost: "",
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
    "editedItem.room_id": {
      async handler(newValue) {
        console.log("Watcher Res | Room ID:", newValue);
      },
      deep: true,
    },

    "editedItem.check_in_date": {
      handler() {
        this.updateTotalCost(this.editedItem.room_id);
      },
      deep: true,
    },

    "editedItem.check_out_date": {
      handler() {
        this.updateTotalCost(this.editedItem.room_id);
      },
      deep: true,
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
    formatDateForPicker(date) {
      if (date) {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      return null;
    },

    revertFormattedDate(dateString) {
      if (dateString) {
        const dateArray = dateString.split("-");
        const formattedDate = `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
        return formattedDate;
      }
      return null;
    },

    // Inside editReservation method
    editReservation(item) {
      this.editedIndex = this.data.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.check_in_date = this.formatDateForPicker(
        this.editedItem.check_in_date
      );
      this.editedItem.check_out_date = this.formatDateForPicker(
        this.editedItem.check_out_date
      );
      this.isNewItem = false;
    },

    deleteReservation(item) {
      const index = this.data.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.data.splice(index, 1);
    },

    updateOrAddReservation() {
      let confirmationMessage = "";
      if (this.editedIndex > -1) {
        confirmationMessage =
          "Are you sure you want to update this reservation?";
      } else {
        confirmationMessage = "Are you sure you want to add this reservation?";
      }

      if (confirm(confirmationMessage)) {
        if (this.editedIndex > -1) {
          const updatedItem = Object.assign({}, this.editedItem);
          updatedItem.check_in_date = this.revertFormattedDate(
            this.editedItem.check_in_date
          );
          updatedItem.check_out_date = this.revertFormattedDate(
            this.editedItem.check_out_date
          );

          this.data.splice(this.editedIndex, 1, updatedItem);
        } else {
          const newItem = Object.assign({}, this.editedItem);
          newItem.check_in_date = this.revertFormattedDate(
            this.editedItem.check_in_date
          );
          newItem.check_out_date = this.revertFormattedDate(
            this.editedItem.check_out_date
          );

          this.data.push(newItem);
        }

        this.emptyFields();
        this.isNewItem = true;
        this.$emit("update:roomReservations", this.data);
      }
    },

    refresh() {
      this.getAvailableRooms();
      this.getAllRooms();
    },

    emptyFields() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.isNewItem = true;
    },

    async getAllRooms() {
      try {
        await this.roomStore.getRooms();
      } catch (error) {
        console.log(error);
      }
    },

    async getRoomById() {
      const id = this.editedItem.room_id;
      console.log("Res getRoomById | Room ID:", id);
      try {
        const rooms = this.roomStore.rooms;
        rooms.forEach((element) => {
          if (element.room_id === id) {
            console.log("Res getRoomById | Room:", element);
            this.room.number = element.room_number;
            this.room.type = element.type.type_name;
            this.room.rate = element.type.rate;
          }
        });
      } catch (error) {
        console.error(error);
      }
    },

    async getAvailableRooms() {
      try {
        this.availableRooms.items = this.roomStore.availableRooms;
      } catch (error) {
        console.log(error);
      }
    },

    async getUnavailableRooms() {
      try {
        this.unavailableRooms = this.roomStore.unavailableRooms;
      } catch (error) {
        console.log(error);
      }
    },

    // Utils

    async updateTotalCost(id) {
      console.log("Res UpT | Room ID:", id);
      console.log("Res UpT | Available rooms:", this.availableRooms);
      try {
        const selectedRoom = this.availableRooms.items.find(
          (room) => room.room_id === id
        );
        console.log("Res UpT | Selected room:", selectedRoom);
        if (selectedRoom) {
          const rate = parseFloat(selectedRoom.type.rate); // Parsing rate as float
          this.editedItem.total_cost = this.totalCostCalc(rate);
        }
      } catch (error) {
        console.log(error);
      }
    },

    totalCostCalc(rate) {
      const checkInDate = new Date(this.editedItem.check_in_date);
      const checkOutDate = new Date(this.editedItem.check_out_date);

      const timeDifference = Math.abs(checkOutDate - checkInDate);
      const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      const totalCost = rate * numberOfDays;
      console.log("Res | Total cost:", totalCost);
      return totalCost;
    },
  },

  async created() {
    this.roomStore = useRoomStore();
    this.getAvailableRooms();
    this.getAllRooms();
  },
};
</script>

<style scoped></style>

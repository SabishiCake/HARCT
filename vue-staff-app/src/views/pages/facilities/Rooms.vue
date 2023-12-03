<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col> <h1>Rooms</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="roomSearch"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn
              color="success"
              prepend-icon="mdi-plus"
              @click="openNewDialog"
              text
              block
            >
              add New
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title> All Rooms </v-toolbar-title>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="roomPagination.length === 0">
                    <div class="text-h6">
                      <span> No Rooms Found</span>
                    </div>
                  </v-col>
                  <v-col
                    v-for="(room, index) in roomPagination"
                    :key="index"
                    cols="auto"
                    sm="6"
                    md="4"
                  >
                    <v-card>
                      <v-toolbar color="primary">
                        <v-toolbar-title>
                          Room
                          {{ room.room_number }}
                        </v-toolbar-title>
                      </v-toolbar>

                      <v-card-text>
                        <div class="text-h6">
                          <span>Room Type: </span>
                          <span>{{ room.type.type_name }}</span>
                        </div>

                        <div class="text-h6">
                          <span>Is Occupied: </span>
                          <span>
                            <v-chip
                              close
                              :color="room.is_occupied ? 'green' : 'red'"
                              >{{ room.is_occupied ? "Yes" : "No" }}</v-chip
                            >
                          </span>
                        </div>

                        <div class="text-h6">
                          <span>Room Rate: </span>
                          <span>{{ room.type.rate }}</span>
                        </div>

                        <div>
                          <span class="text-h6">Description: </span>
                          <br />
                          <span>{{ room.type.description }}</span>
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-container grid-list-xs>
                          <v-row>
                            <v-col cols="6">
                              <v-btn
                                color="primary"
                                @click="openEditDialog(room)"
                                text
                                block
                                >Edit</v-btn
                              >
                            </v-col>
                            <v-col cols="6">
                              <v-btn
                                color="error"
                                @click="deleteRoom(room.room_id)"
                                text
                                block
                                >Delete</v-btn
                              >
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-pagination
                      v-model="pagination.currentPage"
                      :length="
                        Math.ceil(filteredRooms.length / pagination.rowPerPage)
                      "
                    ></v-pagination>
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
            <v-toolbar-title
              >{{ dialog.title }}
              <span> Id {{ dialog.item.room_id }}</span></v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-xs>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.item.room_number"
                    label="Room Number"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="dialog.item.type.type_name"
                    :items="typeNames"
                    item-text="type_name"
                    item-value="id"
                    label="Room Type"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-container grid-list-xs>
              <v-row>
                <v-col cols="6">
                  <v-btn
                    color="primary"
                    @click="dialog.isEdit ? updateRoom() : addNewRoom()"
                    text
                    block
                    >{{ dialog.isEdit ? "Save" : "Add" }}</v-btn
                  >
                </v-col>
                <v-col cols="6">
                  <v-btn color="error" @click="dialog.model = false" text block
                    >Cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <v-snackbar v-model="snackbar.model" :color="snackbar.color">
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
import apiHandler from "@/services/apiHandler";
import { useRoomStore } from "@/store/room";
export default {
  data() {
    return {
      roomStore: null,
      roomSearch: "",
      allRooms: [],
      allRoomTypes: [],
      typeNames: [],

      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },

      snackbar: {
        model: false,
        timeout: 3000,
        text: "",
        color: "",
      },

      dialog: {
        isEdit: false,
        model: false,
        title: "",
        item: null,
      },
    };
  },
  computed: {
    filteredRooms() {
      const searchTerm = this.roomSearch.toLowerCase();
      return this.allRooms.filter((room) => {
        return (
          room.room_number.toLowerCase().includes(searchTerm) ||
          room.room_type.toLowerCase().includes(searchTerm)
        );
      });
    },

    roomPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredRooms.slice(start, end);
    },
  },

  methods: {
    refresh() {
      this.getRooms();
    },

    openEditDialog(item) {
      this.dialog.isEdit = true;
      this.dialog.model = true;
      this.dialog.title = "Edit Room";
      this.dialog.item = item;
    },

    openNewDialog() {
      this.dialog.isEdit = false;
      this.dialog.model = true;
      this.dialog.title = "Add New Room";
      this.dialog.item = {
        room_number: "",
        type: {
          type_name: "",
        },
      };
    },

    addNewRoom() {
      try {
        if (!confirm("Are you sure you want to add this room?")) return;
        const typeName = this.dialog.item.type.type_name;
        const findRoomIdByTypeName = (typeName) => {
          try {
            const roomType = this.allRoomTypes.find(
              (type) => type.type_name === typeName
            );
            return roomType.type_id;
          } catch (error) {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text =
              "Room Creation Failed. Most likely due to invalid room type or room number";
            this.snackbar.color = "error";
          }
        };
        const roomTypeId = findRoomIdByTypeName(typeName);
        const roomNumber = this.dialog.item.room_number;
        if (!roomTypeId) {
          this.snackbar.model = true;
          this.snackbar.text = "Room Creation Failed";
          this.snackbar.color = "error";
          this.dialog.model = false;
          return;
        }

        apiHandler
          .post(`rooms/${roomTypeId}`, {
            RoomNumber: roomNumber,
          })
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Room Created Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getRooms();
          })
          .catch((error) => {
            this.snackbar.model = true;
            this.snackbar.text = "Room Creation Failed";
            this.snackbar.color = "error";
            this.dialog.model = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    deleteRoom(roomId) {
      try {
        if (!confirm("Are you sure you want to delete this room?")) return;
        apiHandler
          .delete(`rooms/${roomId}`)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Room Deleted Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getRooms();
          })
          .catch((error) => {
            this.snackbar.model = true;
            this.snackbar.text = "Room Deletion Failed";
            this.snackbar.color = "error";
            this.dialog.model = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    updateRoom() {
      try {
        if (!confirm("Are you sure you want to update this room?")) return;

        const typeName = this.dialog.item.type.type_name;
        const findRoomIdByTypeName = (typeName) => {
          try {
            const roomType = this.allRoomTypes.find(
              (type) => type.type_name === typeName
            );
            return roomType.type_id;
          } catch (error) {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = "Room Update Failed";
            this.snackbar.color = "error";
            this.dialog.model = false;
          }
        };
        const roomTypeId = findRoomIdByTypeName(typeName);
        const roomId = this.dialog.item.room_id;
        if (!roomTypeId || !roomId) {
          this.snackbar.model = true;
          this.snackbar.text = "Room Update Failed";
          this.snackbar.color = "error";
          this.dialog.model = false;
          return;
        }

        apiHandler
          .put(`rooms/${roomId}/${roomTypeId}`)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Room Updated Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getRooms();
          })
          .catch((error) => {
            this.snackbar.model = true;
            this.snackbar.text = "Room Update Failed";
            this.snackbar.color = "error";
            this.dialog.model = false;
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getRooms() {
      try {
        await this.roomStore.getRooms();
        await this.roomStore.getRoomTypes();
        this.allRooms = this.roomStore.allRooms;
        this.allRoomTypes = this.roomStore.allRoomTypes;
        this.typeNames = this.allRoomTypes.map((type) => type.type_name);

        console.log("ROOMS  ", this.allRooms);
        console.log("ROOM TYPES  ", this.allRoomTypes);
        console.log("TYPE NAMES  ", this.typeNames);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.roomStore = useRoomStore();
    await this.getRooms();
  },
};
</script>

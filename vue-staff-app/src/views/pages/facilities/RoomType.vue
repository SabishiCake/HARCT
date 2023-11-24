<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <h1>Room Type Management</h1>
      </v-container>
    </div>

    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="roomTypeSearch"
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
              block
              >Add New</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Room Type List</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="roomTypePagination.length === 0">
                    <div class="text-h6">
                      <span> No Room Type Found</span>
                    </div>
                  </v-col>
                  <v-col
                    v-for="roomType in roomTypePagination"
                    :key="roomType.type_id"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-card>
                      <v-toolbar color="primary">
                        <v-toolbar-title>{{
                          roomType.type_name
                        }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-card-text>
                        <div>
                          <span class="text-h6"> Type ID: </span>
                          <br />
                          <span>{{ roomType.type_id }}</span>
                        </div>
                        <div>
                          <span class="text-h6"> Rate: </span>
                          <br />
                          <span>{{ roomType.rate }}</span>
                        </div>
                        <div>
                          <span class="text-h6"> Description: </span>
                          <br />
                          <span>{{ roomType.description }}</span>
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-container grid-list-xs>
                          <v-row>
                            <v-col cols="6">
                              <v-btn
                                color="primary"
                                text
                                @click="openEditDialog(roomType)"
                              >
                                <v-icon left>mdi-pencil</v-icon>
                                <span>Edit</span>
                              </v-btn>
                            </v-col>
                            <v-col cols="6">
                              <v-btn
                                color="error"
                                text
                                @click="deleteRoomType(roomType.type_id)"
                              >
                                <v-icon left>mdi-delete</v-icon>
                                <span>Delete</span>
                              </v-btn>
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
                        Math.ceil(
                          filteredRoomTypes.length / pagination.rowsPerPage
                        )
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
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon @click="dialog.model = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-xs>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.item.type_name"
                    label="Room Type Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="dialog.item.rate"
                    label="Rate"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="dialog.item.description"
                    label="Description"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container grid-list-xs>
              <v-row>
                <v-col cols="6">
                  <v-btn
                    color="success"
                    @click="dialog.isEdit ? updateRoomType() : AddNewRoomType()"
                    text
                    block
                  >
                    <span>{{ dialog.isEdit ? "Save" : "Add" }}</span>
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    color="secondary"
                    text
                    @click="dialog.model = false"
                    block
                  >
                    <span>Cancel</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <v-snackbar v-model="snackbar.model">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn color="white" text @click="snackbar.model = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>
<script>
import { useRoomStore } from "@/store/room";
import apiHandler from "@/services/apiHandler";
export default {
  data() {
    return {
      roomTypes: [],
      roomTypeSearch: "",
      roomStore: null,

      pagination: {
        currentPage: 1,
        rowsPerPage: 6,
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
        item: {},
      },
    };
  },

  computed: {
    filteredRoomTypes() {
      const searchTerm = this.roomTypeSearch.toLowerCase();
      return this.roomTypes.filter((roomType) => {
        return (
          roomType.type_id.toString().includes(searchTerm) ||
          roomType.type_name.toLowerCase().includes(searchTerm) ||
          roomType.description.toLowerCase().includes(searchTerm) ||
          roomType.rate.toString().includes(searchTerm)
        );
      });
    },

    roomTypePagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowsPerPage;
      const end = start + this.pagination.rowsPerPage;
      return this.filteredRoomTypes.slice(start, end);
    },
  },

  methods: {
    refresh() {
      this.getAllRoomTypes();
    },

    openEditDialog(item) {
      this.dialog.isEdit = true;
      this.dialog.model = true;
      this.dialog.title = "Edit Room Type";
      this.dialog.item = item;
    },

    openNewDialog() {
      this.dialog.isEdit = false;
      this.dialog.model = true;
      this.dialog.title = "Add New Room Type";

      // Create an empty instance based on the structure of roomTypes
      this.dialog.item = {
        type_id: null,
        type_name: "",
        description: "",
        rate: null,
        // Add other properties as needed and match their data types
      };
    },

    updateRoomType() {
      try {
        if (!confirm("Are you sure you want to update this room type?")) return;
        const id = this.dialog.item.type_id;
        const req = {
          TypeName: this.dialog.item.type_name,
          Description: this.dialog.item.description,
          Rate: this.dialog.item.rate,
        };
        apiHandler
          .put(`roomtypes/${id}`, req)
          .then((res) => {
            console.log(res);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Updated Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getAllRoomTypes();
          })
          .catch((err) => {
            console.log(err);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Updated Failed";
            this.snackbar.color = "error";
          });
        console.log("updateRoomType", this.dialog.item);
      } catch (error) {
        console.log(error);
      }
    },

    AddNewRoomType() {
      console.log("AddNewRoomType", this.dialog.item);
      try {
        if (!confirm("Are you sure you want to add this room type?")) return;
        const req = {
          TypeName: this.dialog.item.type_name,
          Description: this.dialog.item.description,
          Rate: this.dialog.item.rate,
        };
        apiHandler
          .post("roomtypes", req)
          .then((res) => {
            console.log(res);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Added Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getAllRoomTypes();
          })
          .catch((err) => {
            console.log(err);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Added Failed";
            this.snackbar.color = "error";
          });
      } catch (error) {
        console.log(error);
      }
    },

    deleteRoomType(id) {
      try {
        if (!confirm("Are you sure you want to delete this room type?")) return;
        apiHandler
          .delete(`roomtypes/${id}`)
          .then((res) => {
            console.log(res);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Deleted Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getAllRoomTypes();
          })
          .catch((err) => {
            console.log(err);
            this.snackbar.model = true;
            this.snackbar.text = "Room Type Deleted Failed";
            this.snackbar.color = "error";
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllRoomTypes() {
      try {
        await this.roomStore.getRoomTypes();
        this.roomTypes = this.roomStore.allRoomTypes;
        console.log("roomTypes", this.roomTypes);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.roomStore = useRoomStore();
    this.getAllRoomTypes();
  },
};
</script>

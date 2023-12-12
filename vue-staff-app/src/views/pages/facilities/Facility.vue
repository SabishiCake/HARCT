<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col> <h1>Facilities</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="facSearch"
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
                <v-toolbar-title>Facilities</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="filteredFacilities.length === 0">
                    <div class="text-h6">
                      <span>No Facilities Found</span>
                    </div>
                  </v-col>
                  <v-col
                    v-for="(facility, index) in paginatedFacilities"
                    :key="index"
                    cols="auto"
                    sm="6"
                    md="4"
                  >
                    <v-card>
                      <v-toolbar color="primary">
                        <v-toolbar-title>{{
                          facility.facility_name
                        }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-card-text>
                        <div>
                          <span
                            class="text-h6"
                            style="margin-top: 10px; margin-bottom: 10px"
                            >Facility ID:
                          </span>
                          <br />
                          {{ facility.facility_id }}
                        </div>
                        <br />
                        <div>
                          <span
                            class="text-h6"
                            style="margin-top: 10px; margin-bottom: 10px"
                            >Description:
                          </span>
                          <br />
                          {{ facility.description }}
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
                                @click="openEditDialog(facility)"
                                block
                              >
                                Edit
                              </v-btn>
                            </v-col>
                            <v-col cols="6">
                              <v-btn
                                color="error"
                                text
                                @click="deleteFacility(facility.facility_id)"
                                block
                              >
                                Delete
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-pagination
                      v-model="pagination.currentPage"
                      :length="
                        Math.ceil(
                          filteredFacilities.length / pagination.perPage
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
      <v-dialog v-model="fdialog.model" scrollable persistent max-width="500px">
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title>{{ fdialog.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="fdialog.item.facility_name"
              label="Facility Name"
              outlined
              dense
            ></v-text-field>
            <v-textarea
              v-model="fdialog.item.description"
              label="Description"
              outlined
              dense
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-container grid-list-xs>
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    text
                    @click="addOrUpdateFacility"
                    block
                  >
                    Save
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn color="error" text @click="closeDialog" block>
                    Close
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
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
import { useFacilityStore } from "@/store/app";
import { useRoomStore } from "@/store/app";
import apiHandler from "@/services/apiHandler";

export default {
  data() {
    return {
      facilityStore: null,
      allFacilities: [],
      allRooms: [],
      allRoomTypes: [],
      roomSearch: "",
      facSearch: "",
      pagination: {
        currentPage: 1,
        perPage: 6,
      },

      snackbar: {
        model: false,
        text: "",
        color: "",
        timeout: 3000,
        btnColor: "",
      },
      fdialog: {
        isEdit: false,
        model: false,
        item: null,
        title: "",
        text: "",
        color: "",
      },
    };
  },

  computed: {
    filteredFacilities() {
      const searchTerm = this.facSearch.toLowerCase();
      return this.allFacilities.filter(
        (facility) =>
          facility.facility_id.toString().includes(searchTerm) ||
          facility.facility_name.toLowerCase().includes(searchTerm) ||
          facility.description.toLowerCase().includes(searchTerm)
      );
    },

    filteredRooms() {
      const searchTerm = this.roomSearch.toLowerCase();
      return this.allRooms.filter(
        (room) =>
          room.room_id.toString().includes(searchTerm) ||
          room.room_name.toLowerCase().includes(searchTerm) ||
          room.description.toLowerCase().includes(searchTerm)
      );
    },

    filteredRoomTypes() {
      const searchTerm = this.roomSearch.toLowerCase();
      return this.allRoomTypes.filter(
        (roomType) =>
          roomType.room_type_id.toString().includes(searchTerm) ||
          roomType.room_type_name.toLowerCase().includes(searchTerm) ||
          roomType.description.toLowerCase().includes(searchTerm)
      );
    },

    paginatedFacilities() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.filteredFacilities.slice(start, end);
    },

    paginatedRooms() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.filteredRooms.slice(start, end);
    },

    paginatedRoomTypes() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.filteredRoomTypes.slice(start, end);
    },
  },

  methods: {
    async refresh() {
      await this.getFacilities();
    },

    closeDialog() {
      this.fdialog.model = false;
    },

    openNewDialog() {
      this.fdialog.isEdit = false;
      this.fdialog.model = true;
      this.fdialog.item = {
        facility_id: "",
        facility_name: "",
        description: "",
      };
      this.fdialog.title = "Add New Facility";
    },

    openEditDialog(item) {
      this.fdialog.isEdit = true;
      this.fdialog.model = true;
      this.fdialog.item = item;
      this.fdialog.title = "Edit Facility";
    },

    addOrUpdateFacility() {
      if (this.fdialog.isEdit) {
        this.updateFacility();
      } else {
        this.addNewFacitiy();
      }
    },

    addNewFacitiy() {
      try {
        if (!confirm("Are you sure you want to add this facility?")) return;
        const req = {
          FacilityName: this.fdialog.item.facility_name,
          Description: this.fdialog.item.description,
        };

        apiHandler.post("facilities", req).then((res) => {
          console.log("res", res);
          this.fdialog.model = false;
          this.snackbar.model = true;
          this.snackbar.text = "Facility Added";
          this.snackbar.color = "success";
          this.refresh();
        });
      } catch (error) {
        console.log(error);
      }
    },

    updateFacility() {
      try {
        if (!confirm("Are you sure you want to update this facility?")) return;
        const req = {
          FacilityName: this.fdialog.item.facility_name,
          Description: this.fdialog.item.description,
        };

        apiHandler
          .put(`facilities/${this.fdialog.item.facility_id}`, req)
          .then((res) => {
            console.log("res", res);
            this.fdialog.model = false;
            this.snackbar.model = true;
            this.snackbar.text = "Facility Updated";
            this.snackbar.color = "success";
            this.refresh();
          });
      } catch (error) {
        console.log(error);
      }
    },

    async deleteFacility(facilityId) {
      try {
        if (!confirm("Are you sure you want to delete this facility?")) return;

        await apiHandler.delete(`facilities/${facilityId}`);
        this.snackbar.model = true;
        this.snackbar.text = "Facility Deleted";
        this.snackbar.color = "success";
        this.refresh();
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
        console.log("allRooms", this.allRooms);
        console.log("allRoomTypes", this.allRoomTypes);
      } catch (error) {
        console.log(error);
      }
    },

    async getFacilities() {
      try {
        await this.facilityStore.getFacilities();
        this.allFacilities = this.facilityStore.allFacilities;
        console.log("allFacilities", this.allFacilities);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.facilityStore = useFacilityStore();
    this.roomStore = useRoomStore();
    await this.getRooms();
    await this.getFacilities();
  },
};
</script>

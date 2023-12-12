<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Tasks</h1></v-col>
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
                    v-model="taskSearch"
                    prepend-inner-icon="mdi-magnify "
                    label="Search"
                    single-line
                    hide-details
                    flat
                    variant="outlined"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-row>
                    <v-col>
                      <v-btn
                        color="primary"
                        prepend-icon="mdi-calendar"
                        text
                        @click="toggleToday"
                        block
                      >
                        {{ isToday.model ? "All" : "Today's" }}
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        color="success"
                        prepend-icon="mdi-plus"
                        @click="openNewTaskDialog"
                        text
                        block
                        >Add New</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-row dense>
                    <v-col>
                      <div class="text-h6">
                        <span>Filter by Status</span>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>
                      <v-switch
                        v-model="status.pending"
                        color="primary"
                        label="Pending"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon>mdi-check</v-icon>
                            <span>{{
                              status.pending ? "Pending" : "Not Pending"
                            }}</span>
                          </div>
                        </template>
                      </v-switch>
                    </v-col>
                    <v-col>
                      <v-switch
                        v-model="status.inProgress"
                        color="primary"
                        label="In Progress"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon>mdi-check</v-icon>
                            <span>{{
                              status.inProgress
                                ? "In Progress"
                                : "Not In Progress"
                            }}</span>
                          </div>
                        </template>
                      </v-switch>
                    </v-col>
                    <v-col>
                      <v-switch
                        v-model="status.completed"
                        color="primary"
                        label="Completed"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon>mdi-check</v-icon>
                            <span>{{
                              status.completed ? "Completed" : "Not Completed"
                            }}</span>
                          </div>
                        </template>
                      </v-switch>
                    </v-col>
                    <v-col>
                      <v-switch
                        v-model="status.cancelled"
                        color="primary"
                        label="Cancelled"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon>mdi-check</v-icon>
                            <span>{{
                              status.cancelled ? "Cancelled" : "Not Cancelled"
                            }}</span>
                          </div>
                        </template>
                      </v-switch>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card min-height="500px">
              <v-toolbar color="primary">
                <v-toolbar-title>Task Details</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn icon @click="refresh">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>

              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="filteredTasks.length === 0">
                    <div class="text-h6">
                      <span>No Tasks Found</span>
                    </div>
                  </v-col>
                  <v-col
                    v-for="(tasks, index) in paginatedTasks"
                    :key="index"
                    cols="auto"
                    sm="6"
                    md="4"
                  >
                    <v-card>
                      <v-toolbar color="secondary">
                        <v-toolbar-title>{{ tasks.task_name }}</v-toolbar-title>
                      </v-toolbar>

                      <v-card-text>
                        <div>
                          <span>Task Id: </span>
                          {{ tasks.task_id }}
                        </div>
                        <div>
                          <span>Room No.: </span>
                          {{ tasks.room_number }}
                        </div>

                        <div>
                          <span>Status: </span>
                          {{ tasks.status }}
                        </div>
                        <div>
                          <span>Created At: </span>
                          {{ formatDate(tasks.created_at) }}
                        </div>
                        <div>
                          <span>Updated At: </span>
                          {{ formatDate(tasks.updated_at) }}
                        </div>
                        <br />
                        <div>
                          <span class="text-h6">Description: </span>
                          <br />
                          {{ textLimit(tasks.description, 50) }}
                        </div>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-container grid-list-xs>
                          <v-row>
                            <v-col>
                              <v-btn
                                color="success"
                                text
                                prepend-icon="mdi-pencil"
                                @click="openEditDialog(tasks)"
                                block
                              >
                                Edit
                              </v-btn>
                            </v-col>
                            <v-col>
                              <v-btn
                                color="primary"
                                text
                                prepend-icon="mdi-eye"
                                @click="viewTask(tasks)"
                                block
                              >
                                View
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
                        Math.ceil(filteredTasks.length / pagination.rowsPerPage)
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
      <v-dialog
        v-model="dialog.model"
        max-width="500px"
        persistent
        content-class="rounded"
        scrollable
      >
        <v-card>
          <v-toolbar color="primary">
            <v-btn icon @click="closeDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="form"
              v-model="form"
              lazy-validation
              class="px-3"
              @submit.prevent="onSubmit"
            >
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="dialog.item.task_name"
                      :readonly="dialog.isView"
                      label="Task Name"
                      outlined
                      dense
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="dialog.item.description"
                      :readonly="dialog.isView"
                      label="Description"
                      outlined
                      dense
                      :rules="[rules.required]"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="dialog.item.room_number"
                      :readonly="dialog.isView"
                      label="Room Number"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="!dialog.isEdit">
                    <div><span>Created At: </span></div>
                    <vue-date-picker
                      v-model="dialog.item.created_at"
                      :readonly="dialog.isView"
                      label="Created At"
                      outlined
                      dense
                      required
                    ></vue-date-picker>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" v-if="dialog.isEdit">
                    <div>
                      <span>Updated At: </span>
                    </div>
                    <vue-date-picker
                      v-model="dialog.item.updated_at"
                      :readonly="dialog.isView"
                      label="Updated At"
                      outlined
                      dense
                      required
                    ></vue-date-picker>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="dialog.item.status"
                      :readonly="dialog.isView"
                      :items="status.names"
                      label="Status"
                      outlined
                      dense
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-container grid-list-xs>
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    text
                    block
                    type="submit"
                    :disabled="dialog.isView || !form"
                    @click="dialog.isEdit ? updateTask() : onSubmit()"
                    >{{ dialog.isEdit ? "Update" : "Add" }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import { useTaskStore, useRoomStore } from "@/store/app";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import apiHandler from "@/services/apiHandler";
export default {
  data() {
    return {
      taskStore: null,
      roomStore: null,
      taskSearch: "",
      form: false,

      rooms: [],

      rules: {
        required: (value) => !!value || "Required.",
      },

      pagination: {
        currentPage: 1,
        rowsPerPage: 6,
      },

      isToday: {
        model: false,
      },

      status: {
        model: true,
        names: ["pending", "inProgress", "completed", "cancelled"],
        pending: true,
        inProgress: true,
        completed: false,
        cancelled: false,
      },

      dialog: {
        isNew: false,
        isView: false,
        isEdit: false,
        item: {},
        model: false,
        title: "",
      },

      allTasks: [],
    };
  },

  watch: {
    status: {
      handler() {
        this.getAllTasks();
      },
      deep: true,
    },
  },

  computed: {
    filteredTasks() {
      return this.allTasks.filter((task) =>
        Object.keys(task).some((key) =>
          String(task[key])
            .toLowerCase()
            .includes(this.taskSearch.toLowerCase())
        )
      );
    },

    paginatedTasks() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowsPerPage;
      const end = start + this.pagination.rowsPerPage;
      return this.filteredTasks.slice(start, end);
    },
  },

  methods: {
    formatDate(date) {
      console.log("date", date);
      const newdate = new Date(date); // Create a date object in local time
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const utcDate = new Date(
        newdate.getTime() + newdate.getTimezoneOffset() * 60000
      ); // Convert to UTC
      const readableDate = utcDate.toLocaleDateString("en-US", options);
      console.log("readableDate", readableDate);
      return readableDate;
    },

    textLimit(text, limit) {
      if (text.length > limit) {
        return text.substring(0, limit) + "...";
      } else {
        return text;
      }
    },

    onSubmit() {
      if (!this.form) return;
      try {
        this.addNewTask();
      } catch (error) {
        console.log(error);
      }
    },

    openEditDialog(task) {
      this.dialog.item = task;
      this.dialog.isView = false;
      this.dialog.isEdit = true;
      this.dialog.model = true;
      this.dialog.title = "Edit Task";
    },

    resetFields() {
      const today = new Date().toLocaleDateString();
      this.dialog.item = {
        task_name: "",
        description: "",
        room_number: "",
        status: "pending",
        created_at: today,
        updated_at: today,
      };
    },

    openNewTaskDialog() {
      try {
        this.dialog.isView = false;
        this.dialog.isEdit = false;
        this.dialog.model = true;
        this.dialog.title = "Add New Task";
      } catch (error) {
        console.log(error);
      }
    },

    updateTask() {
      const taskId = this.dialog.item.task_id;
      try {
        const req = {
          TaskId: this.dialog.item.task_id,
          TaskName: this.dialog.item.task_name,
          TaskDescription: this.dialog.item.description,
          RoomNumber: this.dialog.item.room_number,
          Status: this.dialog.item.status,
          UpdatedAt: this.dialog.item.updated_at,
        };
        apiHandler
          .put(`tasks/${taskId}`, req)
          .then((res) => {
            console.log(res);
            this.getAllTasks();
            this.closeDialog();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    addNewTask() {
      try {
        const req = {
          TaskName: this.dialog.item.task_name,
          TaskDescription: this.dialog.item.description,
          RoomNumber: this.dialog.item.room_number,
          Status: this.dialog.item.status,
          CreatedAt: this.dialog.item.created_at,
        };
        apiHandler
          .post("tasks", req)
          .then((res) => {
            console.log(res);
            this.getAllTasks();
            this.closeDialog();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    viewTask(task) {
      this.dialog.item = task;
      this.dialog.isView = true;
      this.dialog.isEdit = false;
      this.dialog.model = true;
      this.dialog.title = "View Task";
    },

    closeDialog() {
      this.dialog.model = false;
      this.dialog.isView = false;
      this.dialog.isEdit = false;
      this.resetFields();
      this.refresh();
    },

    toggleToday() {
      this.isToday.model = !this.isToday.model;
      this.getAllTasks();
    },

    refresh() {
      this.getAllTasks();
    },

    async getAllRoomNumber() {
      try {
        await this.roomStore.getRooms();
        const rooms = this.roomStore.allRooms;
        rooms.forEach((room) => {
          this.rooms.push(room.room_number);
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllTasks() {
      try {
        await this.taskStore.getAllTasks();
        const today = new Date().toLocaleDateString();

        console.log("all tasks", this.taskStore.allTasks);
        this.allTasks = this.taskStore.allTasks.filter((task) => {
          const taskDate = new Date(task.updated_at).toLocaleDateString();
          const taskStat = task.status;

          // Check if the task is for today or matches the status filters
          const todayCondition = !this.isToday.model || taskDate === today;
          const statusCondition =
            (this.status.pending && taskStat === "pending") ||
            (this.status.inProgress && taskStat === "inProgress") ||
            (this.status.completed && taskStat === "completed") ||
            (this.status.cancelled && taskStat === "cancelled");

          return todayCondition && statusCondition;
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getPendingTasks() {
      try {
        await this.getAllTasks();
        this.pendingTasks = this.allTasks.filter(
          (task) => task.status === "pending"
        );
        console.log("pending tasks", this.pendingTasks);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.roomStore = useRoomStore();
    this.taskStore = useTaskStore();
    this.resetFields();
    this.getAllRoomNumber();
    this.getAllTasks();
  },
};
</script>

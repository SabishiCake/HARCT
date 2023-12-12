<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Dashboard</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Today's Tasks</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn @click="refresh" icon>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col>
                      <div class="text-h6">
                        Today's Tasks ({{ todayTasks.length }})
                      </div>
                    </v-col>

                    <v-col>
                      <div class="text-h6">
                        Pending Tasks ({{ pendingTasks.length }})
                      </div>
                    </v-col>
                    <v-col>
                      <div class="text-h6">
                        In Progress Tasks ({{ inProgressTasks.length }})
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Pending Tasks</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn @click="refresh" icon>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text
                ><v-container grid-list-xs>
                  <v-row>
                    <v-col
                      v-if="filteredPendingTasks.length === 0"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div>No Pending Tasks</div>
                    </v-col>
                    <v-col
                      v-for="(task, index) in pendingTasksPagination"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card>
                        <v-toolbar color="secondary">
                          <v-toolbar-title>
                            {{ task.task_name }}
                          </v-toolbar-title>
                        </v-toolbar>

                        <v-card-text>
                          <div>{{ task.description }}</div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            text
                            prepend-icon="mdi-eye"
                            block
                            @click="viewTask(task.task_id)"
                          >
                            view
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-pagination
                        v-model="pagination.currentPage"
                        :length="Math.ceil(pendingTasks.length / 6)"
                        circle
                        @input="refresh"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>In Progress Tasks</v-toolbar-title>
              </v-toolbar>
              <v-card-text
                ><v-container grid-list-xs>
                  <v-row>
                    <v-col
                      v-if="filteredInProgressTasks.length === 0"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <div>No In Progress Tasks</div>
                    </v-col>
                    <v-col
                      v-for="(task, index) in inProgressTasksPagination"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card>
                        <v-toolbar color="secondary">
                          <v-toolbar-title>{{
                            task.task_name
                          }}</v-toolbar-title>
                        </v-toolbar>

                        <v-card-text>
                          <div>{{ task.description }}</div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            text
                            prepend-icon="mdi-eye"
                            block
                            @click="viewTask(task.task_id)"
                          >
                            view
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-pagination
                        v-model="pagination.currentPage"
                        :length="Math.ceil(inProgressTasks.length / 6)"
                        circle
                        @input="refresh"
                      ></v-pagination>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-dialog
        v-model="dialog.nodel"
        max-width="500px"
        @click:outside="dialog.nodel = false"
      >
        <v-card>
          <v-toolbar color="primary">
            <v-toolbar-title>Task Details</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card-text>
            <v-container grid-list-xs>
              <v-row>
                <v-col>
                  <div>Task Name: {{ dialog.task?.task_name }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>Task Description: {{ dialog.task?.description }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>Task No. : {{ dialog.task?.room_number }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>Task Status: {{ dialog.task?.status }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>
                    Task Created At: {{ formatDate(dialog.task?.created_at) }}
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>
                    Task Updated At: {{ formatDate(dialog.task?.updated_at) }}
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="error" text block="" @click="dialog.nodel = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import { useTaskStore } from "@/store/app";
export default {
  data() {
    return {
      taskStore: null,
      tasks: [],
      todayTasks: [],
      pendingTasks: [],
      inProgressTasks: [],

      dialog: {
        nodel: false,
        task: null,
      },

      pagination: {
        currentPage: 1,
        rowperPage: 6,
      },
    };
  },

  computed: {
    filteredTodayTasks() {
      return this.todayTasks.slice(
        (this.pagination.currentPage - 1) * this.pagination.rowperPage,
        this.pagination.currentPage * this.pagination.rowperPage
      );
    },
    filteredPendingTasks() {
      return this.pendingTasks.slice(
        (this.pagination.currentPage - 1) * this.pagination.rowperPage,
        this.pagination.currentPage * this.pagination.rowperPage
      );
    },

    filteredInProgressTasks() {
      return this.inProgressTasks.slice(
        (this.pagination.currentPage - 1) * this.pagination.rowperPage,
        this.pagination.currentPage * this.pagination.rowperPage
      );
    },

    pendingTasksPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowperPage;
      const end = start + this.pagination.rowperPage;
      return this.pendingTasks.slice(start, end);
    },

    todayTasksPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowperPage;
      const end = start + this.pagination.rowperPage;
      return this.todayTasks.slice(start, end);
    },

    inProgressTasksPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowperPage;
      const end = start + this.pagination.rowperPage;
      return this.inProgressTasks.slice(start, end);
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

    viewTask(id) {
      this.dialog.nodel = true;
      this.dialog.task = this.tasks.find((task) => task.task_id === id);
    },

    async refresh() {
      this.taskStore = useTaskStore();
      await this.getTasks();
      await this.taskStore.getAllTasks();
    },

    async getTasks() {
      try {
        const today = new Date().toLocaleDateString();
        await this.taskStore.getAllTasks();
        this.tasks = this.taskStore.allTasks;

        console.log("tasks", this.tasks);

        this.todayTasks = this.tasks.filter(
          (task) => new Date(task.updated_at).toLocaleDateString() === today
        );
        this.pendingTasks = this.todayTasks.filter(
          (task) => task.status === "pending"
        );
        this.inProgressTasks = this.todayTasks.filter(
          (task) => task.status === "inProgress"
        );
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.taskStore = useTaskStore();
    await this.getTasks();
    await this.taskStore.getAllTasks();
  },
};
</script>

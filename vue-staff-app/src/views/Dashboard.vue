<template>
  <v-app v-if="!loading">
    <!-- <NavBar /> -->
    <NavBar2 />
    <v-main>
      <router-view />
    </v-main>
    <SnackBar
      ref="SnackBar"
      :text="snackbar.text"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    ></SnackBar>
  </v-app>
</template>

<script>
import { useLoginStore, useTaskStore } from "@/store/app";
import NavBar2 from "@/components/NavBar2.vue";
import SnackBar from "@/components/SnackBar.vue";
export default {
  name: "App",
  components: {
    NavBar2,
    SnackBar,
  },
  data() {
    return {
      loading: true,
      oldTask: [],
      newTask: [],

      snackbar: {
        model: false,
        text: "",
        color: "error",
        timeout: 3000,
      },
    };
  },
  watch: {
    newTask(newValue, oldValue) {
      const newTaskIds = newValue.map((task) => task.task_id);
      const oldTaskIds = oldValue.map((task) => task.task_id);

      const addedTaskIds = newTaskIds.filter((id) => !oldTaskIds.includes(id));
      const addedPendingTasks = newValue.filter(
        (task) =>
          addedTaskIds.includes(task.task_id) && task.status === "pending"
      );

      if (addedPendingTasks.length > 0) {
        this.oldTask = [...newValue];
        this.snackbar.text = `${addedPendingTasks.length} New Pending Task(s) Added`;
        this.snackbar.color = "success";
        this.$refs.SnackBar.model = true;
      }
    },
  },

  methods: {
    checkForNewTask() {
      // Notification.requestPermission().then(function (result) {
      //   console.log(result);
      // });

      const taskStore = useTaskStore();
      taskStore.getAllTasks();
      this.newTask = [...taskStore.allTasks];
      // console.log("checkForNewTask", taskStore.allTasks);
    },
  },

  created() {
    const loginStore = useLoginStore();
    const isLoggedIn = loginStore.isLoggedIn;
    console.log("Dashboard | isLoggedIn", isLoggedIn);
    if (!isLoggedIn) {
      this.$router.push({ name: "login" });
    } else {
      this.loading = false;
      setInterval(this.checkForNewTask, 10000); // Check for new tasks every 10 seconds
    }
  },
};
</script>

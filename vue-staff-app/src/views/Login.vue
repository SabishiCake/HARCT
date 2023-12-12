<template>
  <div>
    <v-sheet class="pa-10" color="secondary" height="100vh" rounded>
      <!-- Change the logo of whatever you want -->
      <v-img
        alt="Vue.js logo"
        class="mx-auto mb-10"
        contain
        height="64"
        src="../assets/logo.png"
        width="64"
      ></v-img>
      <h1 class="text-center mb-6 text-white">HARCT Staff App</h1>
      <v-container grid-list-xs dense>
        <v-row>
          <v-col>
            <v-card class="mx-auto px-6 py-8" max-width="344">
              <v-form v-model="form" @submit.prevent="onSubmit">
                <v-container grid-list-xs dense>
                  <v-row no-gutters>
                    <v-col>
                      <v-text-field
                        v-model="username"
                        :readonly="loading"
                        :rules="[required]"
                        class="mb-2"
                        clearable
                        label="Username"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col>
                      <v-text-field
                        v-model="password"
                        :readonly="loading"
                        :rules="[required]"
                        clearable
                        label="Password"
                        placeholder="Enter your password"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="8">
                      <v-btn
                        :disabled="!form"
                        :loading="loading"
                        block
                        color="success"
                        size="large"
                        type="submit"
                        variant="elevated"
                      >
                        Sign In
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        block
                        color="primary"
                        size="large"
                        variant="elevated"
                        @click="openDbSetting"
                      >
                        <v-icon> mdi-cog </v-icon>
                        <v-tooltip bottom activator="parent">
                          API Configuration Settings
                        </v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center">
            <div class="">
              <v-icon>mdi-lightning-bolt</v-icon>
              Powered by
              <a
                class="text-decoration-none"
                href="https://vuejs.org"
                target="_blank"
                >Vue.js</a
              >
              and
              <a
                class="text-decoration-none"
                href="https://vuetifyjs.com"
                target="_blank"
                >Vuetify</a
              >
            </div>
          </v-col>
        </v-row>
        <v-row justify="center" dense>
          <v-col class="text-center subheading text-disabled text-capitalize">
            {{ branch }} branch
          </v-col>
        </v-row>
        <!-- <v-row justify="end">
          <v-col>
            <v-alert
              :value="snackbar.model"
              :color="snackbar.color"
              closable
              border="start"
            >
              <p>
                {{ snackbar.text }}
              </p>
            </v-alert>
          </v-col>
        </v-row> -->
      </v-container>
    </v-sheet>
  </div>
  <div>
    <SnackBar
      ref="SnackBar"
      :text="snackbar.text"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    ></SnackBar>
  </div>
</template>

<script>
import { useLoginStore } from "@/store/app";
import { useAppStore } from "@/store/app";
import { useTheme } from "vuetify/lib/framework.mjs";
import apiHandler from "@/services/apiHandler";

// Components
import SnackBar from "@/components/SnackBar.vue";

export default {
  data() {
    return {
      form: false,
      username: null,
      password: null,
      loading: false,
      test: "test",
      error: {
        model: false,
        timeout: 3000,
        message: "",
        color: "error",
      },

      branch: null,

      snackbar: {
        model: false,
        text: "",
        color: "error",
        timeout: 3000,
      },
    };
  },

  components: {
    SnackBar,
  },

  computed: {
    checkApi() {
      return this.checkApiCon();
    },
  },

  methods: {
    required(v) {
      return !!v || "Field is required";
    },

    async checkApiCon() {
      try {
        const response = await apiHandler.checkApi();
        if (response.status === 200) {
          this.$refs.SnackBar.model = true;
          this.snackbar.text = "API is Connected. You may Login.";
          this.snackbar.color = "success";
        } else {
          this.$refs.SnackBar.model = true;
          this.snackbar.text =
            "API Disconnected or offline. Pls re-configure settings then Refresh the page.";
          this.snackbar.color = "error";
          this.form = false;
        }
      } catch (error) {
        this.$refs.SnackBar.model = true;
        this.snackbar.text =
          "Something went wrong. Pls re-configure settings then Refresh the page.";
        this.snackbar.color = "error";
        this.form = false;
      }
    },

    onSubmit() {
      if (!this.form) return;

      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.login();
      }, 2000);
    },

    async login() {
      try {
        console.log("logging in...");
        const loginStore = useLoginStore();
        // loginStore.helloWorld();
        await loginStore.mockLogin(this.username, this.password);
        console.log(this.username, this.password);

        const loginState = loginStore.isLoggedIn;
        if (loginState) {
          try {
            await this.$router.push({
              name: "frontOfficeDashboard",
            });
          } catch (error) {
            this.$refs.SnackBar.model = true;
            this.snackbar.text = error.message;
            this.snackbar.color = "error";
          }
        } else {
          this.$refs.SnackBar.model = true;
          this.snackbar.text = "Invalid username or password";
          this.snackbar.color = "error";
        }
      } catch (error) {
        this.$refs.SnackBar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      } finally {
        this.loading = false;
      }
    },

    openDbSetting() {
      this.$router.push({
        name: "dbSettings",
      });
    },

    async setTheme() {
      try {
        const theme = useAppStore().currentTheme;
        if (theme === null) return;

        const globalTheme = useTheme();
        globalTheme.global.name = JSON.parse(theme);
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    const loginStore = useLoginStore();
    const appStore = useAppStore();

    this.branch = appStore.branch;

    this.checkApiCon();
    // this.setTheme();
    if (loginStore.isLoggedIn) {
      try {
        await this.$router.push({
          name: "frontOfficeDashboard",
        });
      } catch (error) {
        console.log(error);
        this.$refs.SnackBar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      }
    }
  },
};
</script>

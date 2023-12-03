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
      <h1 class="text-center mb-6 text-white">Vue Staff App</h1>
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
                    <v-col cols="10">
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
                    <v-col cols="2">
                      <v-btn
                        block
                        color="primary"
                        size="large"
                        variant="elevated"
                        @click="openDbSetting"
                      >
                        <v-icon> mdi-cog </v-icon>
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
            <!-- {{ test }} -->
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
  <div>
    <!-- Notification -->

    <v-snackbar
      v-model="snackbar.model"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar.model = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { useLoginStore } from "@/store/auth";
import apiHandler from "@/services/apiHandler";
import VueCookies from "vue-cookies";
import { useTheme } from "vuetify/lib/framework.mjs";

export default {
  data() {
    return {
      form: false,
      username: null,
      password: null,
      loading: false,
      test: "test",

      snackbar: {
        model: false,
        text: "",
        color: "error",
        timeout: 3000,
      },
    };
  },

  computed: {
    checkApi() {
      return this.checkApiCon();
    },
  },

  methods: {
    async checkApiCon() {
      try {
        const response = await apiHandler.checkApi();
        if (response.status === 200) {
          this.snackbar.model = true;
          this.snackbar.text = "API is running. You may now login.";
          this.snackbar.color = "success";
        } else {
          this.snackbar.model = true;
          this.snackbar.text =
            "API is not running. Pls re-configure settings then Refresh the page.";
          this.snackbar.color = "error";
          this.form = false;
        }
      } catch (error) {
        this.snackbar.model = true;
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
        const loginStore = useLoginStore();
        loginStore.mockLogin(this.username, this.password);

        const loginState = loginStore.isLoggedIn;
        if (loginState) {
          try {
            await this.$router.push({
              name: "frontOfficeDashboard",
            });
          } catch (error) {
            this.snackbar.model = true;
            this.snackbar.text = error.message;
            this.snackbar.color = "error";
          }
        } else {
          this.snackbar.model = true;
          this.snackbar.text = "Invalid username or password";
          this.snackbar.color = "error";
        }
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      } finally {
        this.loading = false;
      }
    },

    required(v) {
      return !!v || "Field is required";
    },

    openDbSetting() {
      this.$router.push({
        name: "dbSettings",
      });
    },

    async setTheme() {
      try {
        const theme = VueCookies.get("theme");
        const globalTheme = useTheme();
        globalTheme.global.name = theme;
      } catch (error) {
        console.log(error);
      }
    },
  },

  async created() {
    const loginStore = useLoginStore();

    this.checkApiCon();
    // await this.setTheme();
    this.test = VueCookies.get("theme");

    if (loginStore.isLoggedIn) {
      try {
        await this.$router.push({
          name: "frontOfficeDashboard",
        });
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      }
    }
  },
};
</script>

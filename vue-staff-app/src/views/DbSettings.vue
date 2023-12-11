<template>
  <div>
    <v-sheet class="pa-10" color="secondary" height="100vh" rounded>
      <v-container grid-list-xs dense>
        <v-row>
          <v-col>
            <v-card elevation-1>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>API Connectivity Settings</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn color="white" @click="goBack"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-toolbar-items>
              </v-toolbar>
              <v-form v-model="form" @submit.prevent="onSubmit">
                <v-container grid-list-xs>
                  <v-row>
                    <v-col>
                      <v-text-field
                        name="baseUrl"
                        label="Base URL"
                        v-model="baseUrl"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        name="apiKey"
                        label="API Key"
                        v-model="apiKey"
                        :rules="[required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="8">
                      <v-alert
                        v-model="alert.model"
                        :color="alert.color"
                        closable
                        variant="tonal"
                      >
                        {{ alert.text }}
                      </v-alert>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col>
                          <v-btn
                            :disabled="!form"
                            block
                            color="success"
                            size="large"
                            type="submit"
                            variant="elevated"
                          >
                            Save
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn
                            block
                            color="primary"
                            prepend-icon="mdi-tools"
                            size="large"
                            variant="elevated"
                            @click="testCon"
                          >
                            Test
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Theme Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn color="white" @click="goBack"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-toolbar-items>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col
                    v-for="(theme, index) in themeNames.name"
                    :key="index"
                    cols="3"
                  >
                    <v-btn
                      :color="themeNames.color[index]"
                      @click="changeTheme(theme)"
                      block
                    >
                      {{ theme }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
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
import { useTheme } from "vuetify/lib/framework.mjs";
import apiHandler from "@/services/apiHandler";
import VueCookies from "vue-cookies";
import SnackBar from "@/components/SnackBar.vue";

export default {
  data: () => ({
    form: false,
    baseUrl: null,
    apiKey: null,

    globalTheme: null,
    themeStore: null,
    themeNames: {
      name: [],
      color: [],
    },
    themes: [],

    snackbar: {
      text: "",
      color: "",
      timeout: 3000,
    },

    alert: {
      model: false,
      text: "",
      color: "",
      timeout: 3000,
    },
  }),

  components: {
    SnackBar,
  },

  methods: {
    goBack() {
      // this.$router.push({ name: "login" });
      this.$router.go(-1);
    },

    required(v) {
      return !!v || "Field is required";
    },

    reloadPage() {
      window.location.reload();
    },

    async testCon() {
      try {
        const res = await apiHandler.checkApi(this.baseUrl, this.apiKey);
        console.log("API CONNECTION", res);
        if (res === undefined) {
          this.alert.text = "API Connection failed.";
          this.alert.color = "error";
          this.alert.model = true;
        } else {
          this.alert.text = "API Connection successful.";
          this.alert.color = "success";
          this.alert.model = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async checkCredentialsExistence() {
      try {
        const baseUrl = VueCookies.get("baseUrl");
        const apiKey = VueCookies.get("apiKey");

        if (baseUrl && apiKey) {
          this.snackbar.text = "API Credentials found.";
          this.snackbar.color = "success";
          this.$refs.SnackBar.model = true;
        } else {
          this.snackbar.text = "Credentials not found. Pls configure settings.";
          this.snackbar.color = "error";
          this.$refs.SnackBar.model = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getDbCredentials() {
      const apiKey = VueCookies.get("apiKey");
      const baseUrl = VueCookies.get("baseUrl");

      this.baseUrl = baseUrl;
      this.apiKey = apiKey;

      // console.log(this.form);
    },

    onSubmit() {
      confirm("Are you sure you want to save this settings?");

      try {
        VueCookies.set("baseUrl", this.baseUrl);
        VueCookies.set("apiKey", this.apiKey);

        this.snackbar.text = "Settings saved.";
        this.snackbar.color = "success";
        this.$refs.SnackBar.model = true;

        this.reloadPage();
      } catch (error) {
        console.log(error);
      }
    },

    async getThemeNames() {
      try {
        const themes = this.globalTheme.themes;
        this.themeNames.name = Object.keys(themes);
        console.log("THEME NAMES", this.themeNames.name);

        this.themeNames.color = Object.values(themes).map(
          (theme) => theme.colors.primary
        );
        console.log("THEME COLORS", this.themeNames.color);
      } catch (error) {
        console.log(error);
      }
    },

    async changeTheme(value) {
      try {
        const toString = JSON.stringify(value);
        console.log("THEME", toString);

        this.globalTheme.global.name = value;
        VueCookies.set("theme", value);
        console.log("NEW THEME", value);
      } catch (error) {
        console.log(error);
      }
    },

    getPrimaryThemeColor() {
      try {
      } catch (error) {
        console.log(error);
      }
    },
  },

  async mounted() {
    this.globalTheme = useTheme();

    await this.getThemeNames();
    await this.checkCredentialsExistence();
    await this.getDbCredentials();
  },
};
</script>

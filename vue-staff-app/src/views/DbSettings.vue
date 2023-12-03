<template>
  <div>
    <v-sheet class="pa-10" color="secondary" height="100vh" rounded>
      <v-container grid-list-xs dense>
        <v-row>
          <v-col>
            <v-card elevation-1>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Database Connection Settings</v-toolbar-title>
                <v-toolbar-items>
                  <v-btn color="white" @click="goBack"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-toolbar-items>
              </v-toolbar>
              <v-form @submit.prevent="onSubmit"> </v-form>
              <v-container grid-list-xs>
                <v-row>
                  <v-col>
                    <v-text-field
                      name="baseUrl"
                      label="Base URL"
                      v-model="form.baseUrl"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      name="apiKey"
                      label="API Key"
                      v-model="form.apiKey"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="8"> </v-col>
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
                          @click="onSubmit"
                        >
                          Save
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          color="error"
                          size="large"
                          variant="elevated"
                          @click="goBack"
                        >
                          Cancel
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
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
  <div></div>
</template>

<script>
import { useTheme } from "vuetify/lib/framework.mjs";
import VueCookies from "vue-cookies";
export default {
  data: () => ({
    globalTheme: null,
    themStore: null,
    form: {
      apiKey: "",
      baseUrl: "",
      theme: "",
    },
    rules: {
      required: (value) => !!value || "Required.",
    },
    themeStore: null,
    themeNames: {
      name: [],
      color: [],
    },
    themes: [],
  }),

  methods: {
    goBack() {
      this.$router.push({ name: "login" });
    },

    async getDbCredentials() {
      const apiKey = import.meta.env.VITE_APP_API_KEY;
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      this.form.baseUrl = baseUrl;
      this.form.apiKey = apiKey;

      // console.log(this.form);
    },

    onSubmit() {
      confirm("Are you sure you want to save this settings?");

      try {
        this.goBack();
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

    async getThemes() {},
  },

  async mounted() {
    this.globalTheme = useTheme();

    await this.getThemeNames();
    await this.getThemes();
    await this.getDbCredentials();
  },
};
</script>

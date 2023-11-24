<template>
  <div>
    <v-sheet class="pa-10" color="secondary" height="100vh" rounded>
      <v-container grid-list-xs dense>
        <v-row>
          <v-col>
            <v-card elevation-1>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Database Settings</v-toolbar-title>
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
                      color="primary"
                      size="large"
                      variant="elevated"
                      @click="goBack"
                    >
                      Cancel
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
export default {
  data: () => ({
    form: {
      apiKey: "",
      baseUrl: "",
    },
    rules: {
      required: (value) => !!value || "Required.",
    },
  }),

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    async getDbCredentials() {
      const apiKey = import.meta.env.VITE_APP_API_KEY;
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      this.form.baseUrl = baseUrl;
      this.form.apiKey = apiKey;

      console.log(this.form);
    },

    onSubmit() {
      confirm("Are you sure you want to save this settings?");

      try {
        this.goBack();
      } catch (error) {
        console.log(error);
      }
    },
  },

  mounted() {
    this.getDbCredentials();
  },
};
</script>

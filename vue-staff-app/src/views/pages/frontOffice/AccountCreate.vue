<template>
  <v-app>
    <div>
      <v-container fluid>
        <v-row>
          <v-col cols="10">
            <h1>Account Create</h1>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="goBack" color="primary" dark> Go Back </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-form v-model="form" @submit.prevent="saveAccount">
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                name="FirstName"
                label="First Name"
                v-model="data.first_name"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                name="LastName"
                label="Last Name"
                v-model="data.last_name"
                :rules="[rules.required]"
                id="id"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                name="Address"
                label="Address"
                v-model="data.address"
                :rules="[rules.required]"
                id="id"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                name="Email"
                label="Email"
                v-model="data.email"
                :rules="[rules.required]"
                id="id"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                name="Phone"
                label="Phone"
                v-model="data.phone"
                :rules="[rules.phone]"
                id="id"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                name="Username"
                label="Username"
                v-model="data.username"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                name="Password"
                label="Password"
                v-model="data.password"
                :rules="[rules.required, rules.password]"
                :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                id="id"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                name="ConfirmPassword"
                label="Confirm Password"
                v-model="data.confirmPassword"
                :rules="[rules.required, rules.confirmPassword]"
                :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                id="id"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                :disabled="!form"
                type="submit"
                color="success"
                prepend-icon="mdi-content-save"
                block
                >Save Account</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                prepend-icon="mdi-undo"
                @click="resetFields"
                block
                >Reset Fields</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <div>
      <v-snackbar
        v-model="snackbar.model"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
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
import apiHandler from "@/services/apiHandler";

export default {
  data() {
    return {
      form: false,
      data: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        username: "",
        password: "",
        confirmPassword: "",
      },

      visible: false,

      rules: {
        required: (value) => !!value || "Required.",

        email: (value) => {
          const pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
          if (!pattern.test(value.toString())) {
            return "Email is invalid";
          }
        },

        phone: (value) => {
          if (typeof value !== "string") {
            return "Phone must be a string";
          }
          const pattern = /^[0-9]+$/;
          if (!pattern.test(value)) {
            return "Phone is invalid";
          }
          return true;
        },

        password: (value) => {
          if (typeof value !== "string") {
            return "Password must be a string";
          }
          const pattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()-_=+{};:,<.>]{8,}$/;
          if (!pattern.test(value)) {
            return "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number";
          }
          return true;
        },

        confirmPassword: (value) => {
          if (value.toString() !== this.data.password) {
            return "Password does not match";
          }
          return true;
        },
      },

      snackbar: {
        model: false,
        text: "",
        timeout: 3000,
        color: "",
        btnColor: "white",
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    saveAccount() {
      try {
        if (!this.form) return;
        const newdata = {
          LastName: this.data.first_name,
          FirstName: this.data.last_name,
          Email: this.data.email,
          Phone: this.data.phone,
          Address: this.data.address,
          Username: this.data.username,
          Password: this.data.password,
        };
        console.log(newdata);

        apiHandler
          .post("guest", newdata)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Account Created";
            this.snackbar.color = "success";
            // 5 seconds countdown display
            let seconds = 5;
            let timer = setInterval(() => {
              seconds--;
              this.snackbar.text = `Account Created. Redirecting to Account Edit Page in ${seconds} seconds`;
              if (seconds === 0) {
                clearInterval(timer);
              }
            }, 1000);
            this.resetFields();
          })
          // .then(() => {
          //   this.$router.push({
          //     name: "accountEdit",
          //   });
          // })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = "Something went wrong";
            this.snackbar.color = "error";
          });
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      }
    },

    resetFields() {
      try {
        this.data.first_name = "";
        this.data.last_name = "";
        this.data.email = "";
        this.data.phone = "";
        this.data.address = "";
        this.data.username = "";
        this.data.password = "";
        this.data.confirmPassword = "";
        this.snackbar.model = true;
        this.snackbar.text = "Fields Reset";
        this.snackbar.color = "success";
      } catch (error) {
        this.snackbar.model = true;
        this.snackbar.text = error.message;
        this.snackbar.color = "error";
      }
    },
  },
};
</script>

<template>
  <v-app>
    <div>
      <v-container fluid>
        <v-col>
          <v-row>
            <v-col cols="10">
              <h1>Account Edit for ID {{ this.id }}</h1>
            </v-col>
            <v-col cols="auto">
              <v-btn @click="goBack" color="primary" dark> Go Back </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-container>
    </div>
    <div>
      <v-container>
        <v-spacer ma-5></v-spacer>
        <v-row>
          <v-col cols="12">
            <v-form ref="form">
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      name="FirstName"
                      label="First Name"
                      v-model="accountData.guestInfo.first_name"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      name="LastName"
                      label="Last Name"
                      v-model="accountData.guestInfo.last_name"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      name="Email"
                      label="Email Address"
                      suffix="@example.com"
                      v-model="accountData.guestInfo.email"
                      :rules="[rules.email]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      name="Phone"
                      label="Phone"
                      v-model="accountData.guestInfo.phone"
                      :rules="[rules.phone]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      name="Address"
                      label="Address"
                      v-model="accountData.guestInfo.address"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      name="Username"
                      label="Username"
                      v-model="accountData.accountInfo.username"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      name="Password"
                      label="Password"
                      :append-inner-icon="eyeToggle ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="eyeToggle = !eyeToggle"
                      :type="eyeToggle ? 'text' : 'password'"
                      v-model="accountData.accountInfo.password"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :disabled="needConfirm"
                      name="ConfirmPassword"
                      label="Confirm Password"
                      type="password"
                      v-model="ConfirmPassword"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-spacer></v-spacer>

                <v-row>
                  <v-col cols="4">
                    <v-btn
                      :disabled="isTampered"
                      color="success"
                      class="mt-5"
                      append-icon="mdi-content-save"
                      block
                      @click="validate"
                    >
                      Save
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      color="primary"
                      class="mt-5"
                      append-icon="mdi-undo"
                      block
                      @click="undo"
                    >
                      Reset Fields
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <!-- Disabled because deleting a guest account is not and never ideal -->
                    <!-- If situation arisw that an account needs to be deleted from the Database, Contact IT -->
                    <v-btn
                      disabled
                      color="error"
                      class="mt-5"
                      append-icon="mdi-delete"
                      block
                      @click="deleteAccount"
                    >
                      Delete
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-snackbar
              v-model="infoVisible"
              :color="infoColor"
              :timeout="timeout"
            >
              {{ infoText }}
              <template v-slot:actions>
                <v-btn color="white" text @click="infoVisible = false">
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </v-col>
        </v-row>

        <v-spacer></v-spacer>

        <v-spacer></v-spacer>

        <v-row>
          <v-col>
            <RoomResTable
              :guest_id="accountData.guestInfo.guest_id"
              :data="accountData.room_reservations"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { useAccountStore } from "@/store/account";
import apiHandler from "@/services/apiHandler";
import RoomResTable from "@/components/account/modules/RoomResTable2.vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    RoomResTable,
  },

  data() {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          if (!value) {
            return "Required.";
          } else if (!value.includes("@")) {
            return "Invalid Email.";
          } else {
            return true;
          }
        },
        phone: (value) => {
          if (!value) {
            return "Required.";
          } else if (value.length < 11) {
            return "Invalid Phone Number.";
          } else {
            return true;
          }
        },
      },

      isReady: false,

      eyeToggle: false,
      needConfirm: false,
      isTampered: false,

      infoVisible: false,
      infoText: "",
      infoColor: "",
      timeout: 6000,

      ConfirmPassword: "",

      accountData: {
        guestInfo: {
          guest_id: "",
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          address: "",
        },
        accountInfo: {
          account_id: "",
          username: "",
          password: "",
        },
        room_reservations: [],
        table_reservations: [],
        orders: [],
        payments: [],
        feedback: [],
      },
    };
  },

  computed: {
    accountStore() {
      return useAccountStore();
    },

    accountId() {
      return this.$route.params.id;
    },
  },

  methods: {
    goBack() {
      this.$router.go(-1);
      this.isReady = false;
    },

    async fetchAccountData() {
      try {
        await this.accountStore.getAccount(this.accountId);
        this.accountData = this.accountStore.currentAccount;
        this.isReady = true;
      } catch (error) {
        console.log(error);
      }
    },

    async validate() {
      if (this.$refs.form.validate()) {
        await this.updateAccount();
      }
    },

    async undo() {
      await this.fetchAccountData();
    },

    async updateAccount() {
      const id = this.accountData.guestInfo.guest_id;
      const creds = {
        LastName: this.accountData.guestInfo.last_name,
        FirstName: this.accountData.guestInfo.first_name,
        Email: this.accountData.guestInfo.email,
        Phone: this.accountData.guestInfo.phone,
        Address: this.accountData.guestInfo.address,
        Username: this.accountData.accountInfo.username,
        Password: this.accountData.accountInfo.password,
      };

      // ask for confirmation
      const password = this.accountData.accountInfo.password;
      const cPassword = this.ConfirmPassword;

      if (password !== cPassword) {
        this.infoText =
          "Confirm Password Must be filled in Order to update the account.";
        this.infoColor = "error";
        this.infoVisible = true;
        return;
      }

      try {
        const response = await apiHandler.put(`guest/${id}`, creds);
        if (response.status === 200) {
          this.infoText = "Account Updated Successfully";
          this.infoColor = "success";
          this.infoVisible = true;
          await this.fetchAccountData();
        } else {
          this.infoText = "Account Update Failed";
          this.infoColor = "error";
          this.infoVisible = true;
        }
      } catch (error) {
        console.log(error);
        this.infoText = "Error updating account";
        this.infoColor = "error";
        this.infoVisible = true;
      }
    },

    async deleteAccount() {},

    async roomResData() {
      const accountStore = useAccountStore();
      const account = await accountStore.getAccountId(this.id);
      return account.room_reservations;
    },
  },

  async created() {
    await this.fetchAccountData();
  },
};
</script>

<style></style>

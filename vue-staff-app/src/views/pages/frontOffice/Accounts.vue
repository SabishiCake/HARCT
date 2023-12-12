<template>
  <v-app>
    <div>
      <v-container fluid>
        <v-row>
          <v-col cols="10">
            <h1>Account Management</h1>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container fluid dense>
        <v-row>
          <v-col>
            <v-text-field
              v-model="search"
              clearable
              label="Search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-row>
              <v-col>
                <v-btn color="primary" text @click="refresh" block>
                  <v-icon>mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="success" text @click="newAccount" block>
                  <v-icon>mdi-plus</v-icon>
                  Add New
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="accountsHeaderWithAction"
              :items="filteredAccounts"
              class="elevation-1"
              item-key="guest_id"
              :rows-per-page-items="[5, 10, 15]"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  small
                  color="primary"
                  @click="editAccounts(item)"
                  :key="item.guest_id"
                  class="ma-2"
                  text
                >
                  Edit
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div></div>
    <v-snackbar
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      v-model="snackbar.model"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.btnColor" text @click="snackbar.model = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { useAccountStore } from "@/store/app";

export default {
  data() {
    return {
      loading: false,
      value: false,
      search: "",

      snackbar: {
        model: false,
        text: "",
        color: "error",
        timeout: 3000,
        btnColor: "white",
      },

      accountHeaders: [
        { title: "Guest ID", key: "guest_id" },
        // { title: "Name", key: "last_name, " + "first_name" },
        { title: "Last Name", key: "last_name" },
        { title: "First Name", key: "first_name" },
        { title: "Email", key: "email" },
        { title: "Phone", key: "phone" },
        // { title: "Address", key: "address" },
      ],
    };
  },

  computed: {
    filteredAccounts() {
      const accountStore = useAccountStore();
      const searchTerm = this.search.toLowerCase().trim();

      if (!accountStore || !accountStore.accounts) return [];

      return accountStore.accounts.filter((account) =>
        Object.values(account).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    },

    accountsHeaderWithAction() {
      return [...this.accountHeaders, { title: "Actions", key: "actions" }];
    },
  },

  methods: {
    async refresh() {
      if (!this.accountStore) return;

      try {
        this.accountStore.setLoading(true); // Set loading to true
        await this.accountStore.getAccounts();
        this.snackbar.model = true;
        this.snackbar.text = "Accounts refreshed.";
        this.snackbar.color = "success";
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "An error occurred. Please try again.";
        this.snackbar.color = "error";
      } finally {
        this.accountStore.setLoading(false);
      }
    },

    async editAccounts(account) {
      const accountId = account.guest_id;
      this.accountStore.setLoading(true);
      try {
        await this.accountStore.getAccount(accountId);
        setTimeout(() => {
          if (this.accountStore.getLoading) {
            this.snackbar.model = true;
            this.snackbar.text = "An error occurred. Please try again.";
            this.snackbar.color = "error";
          }
        }, 5000);

        this.$router.push({
          name: "accountEdit",
          params: { id: accountId },
        });
        this.accountStore.setAccountId(accountId);
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "An error occurred. Please try again.";
        this.snackbar.color = "error";
      } finally {
        this.accountStore.setLoading(false);
      }
    },

    newAccount() {
      this.$router.push({
        name: "accountCreate",
      });
    },
  },

  async mounted() {
    this.accountStore = useAccountStore();
    await this.refresh();
  },
};
</script>

<style></style>

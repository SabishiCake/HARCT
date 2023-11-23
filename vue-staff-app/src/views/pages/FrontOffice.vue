<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary" pa-5 box>
        <v-toolbar-title>Front Office</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs v-model="activeTab">
            <v-tab
              v-for="tab in tabs"
              :key="tab.id"
              :to="tab.route"
              :disabled="tab.disabled"
              exact
            >
              {{ tab.name }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-window v-model="activeTab">
          <v-window-item
            v-for="tab in tabs"
            :key="tab.id"
            :value="tab.route"
            :color="tab.color"
          >
            <router-view> </router-view>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "/dashboard/frontOffice/accounts",
      tabs: [
        {
          id: 1,
          name: "Dashboard",
          route: {
            name: "frontOfficeDashboard",
          },
          color: "primary",
          disabled: false,
        },
        {
          id: 2,
          name: "Booking",
          route: {
            name: "frontOfficeBooking",
          },
          color: "red",
          disabled: true,
        },
        {
          id: 3,
          name: "Reservation",
          route: {
            name: "frontOfficeReservation",
          },
          color: "green",
          disabled: false,
        },
        {
          id: 4,
          name: "Accounts",
          route: {
            name: "frontOfficeAccounts",
          },
          color: "blue",
          disabled: false,
        },
      ],
    };
  },
};
</script>

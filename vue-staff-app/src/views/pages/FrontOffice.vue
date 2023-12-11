<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary" pa-5 box>
        <v-toolbar-title>Front Office</v-toolbar-title>
        <template v-slot:extension>
          <v-tabs v-model="activeTab">
            <v-tab
              v-for="(tab, i) in tabs"
              :key="i"
              :to="tab.route"
              :disabled="tab.disabled"
              :hidden="tab.isHidden"
            >
              {{ tab.name }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-window v-model="activeTab">
          <v-window-item
            v-for="(tab, i) in tabs"
            :key="i"
            :to="tab.route"
            :disabled="tab.disabled"
            :hidden="tab.isHidden"
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
          name: "Dashboard",
          route: {
            name: "frontOfficeDashboard",
          },
          disabled: false,
          isHidden: false,
        },
        {
          name: "Reservation & Bookings",
          route: {
            name: "frontOfficeReservation",
          },
          disabled: false,
          isHidden: false,
        },
        {
          name: "Accounts",
          route: {
            name: "frontOfficeAccounts",
          },
          disabled: false,
          isHidden: false,
        },
      ],
    };
  },
};
</script>

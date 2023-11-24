<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary" pa-5 box>
        <v-toolbar-title>Room And Facilities Management</v-toolbar-title>
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
      activeTab: {
        name: "facilityDashboard",
      },
      tabs: [
        {
          id: 1,
          name: "Dashboard",
          route: {
            name: "facilityDashboard",
          },
          color: "primary",
          disabled: false,
        },
        {
          id: 2,
          name: "Facilities",
          route: {
            name: "facilities",
          },
          color: "primary",
          disabled: false,
        },
        {
          id: 3,
          name: "Rooms",
          route: {
            name: "rooms",
          },
          color: "primary",
          disabled: false,
        },
        {
          id: 4,
          name: "Room Types",
          route: {
            name: "RoomType",
          },
          color: "primary",
          disabled: false,
        },
      ],
    };
  },
};
</script>

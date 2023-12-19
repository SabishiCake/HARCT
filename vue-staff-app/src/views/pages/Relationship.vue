<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary" pa-5 box>
        <v-toolbar-title>Costumer Relationship Management</v-toolbar-title>
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
      activeTab: "/relationship/relationshipDashboard",
      tabs: [
        {
          name: "Dashboard",
          route: {
            name: "relationshipDashboard",
          },
          disabled: false,
          isHidden: false,
        },
        {
          name: "Feedback",
          route: {
            name: "relationshipFeedback",
          },
          disabled: false,
          isHidden: false,
        },
      ],
    };
  },
};
</script>

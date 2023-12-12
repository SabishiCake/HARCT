<template>
  <v-app>
    <v-card>
      <v-toolbar color="primary" pa-5 box>
        <v-toolbar-title>Supplier And Inventory Management</v-toolbar-title>
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
      activeTab: "/inventory/inventoryDashboard",
      tabs: [
        {
          name: "Dashboard",
          route: {
            name: "inventoryDashboard",
          },
          disabled: false,
          isHidden: false,
        },
        {
          name: "Stock",
          route: {
            name: "inventoryStock",
          },
          disabled: false,
          isHidden: false,
        },
        {
          name: "Supplier",
          route: {
            name: "inventorySupplier",
          },
          disabled: false,
          isHidden: false,
        },
      ],
    };
  },
};
</script>

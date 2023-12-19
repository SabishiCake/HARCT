<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Dashboard</h1></v-col>
        </v-row>
        <v-row>
          <v-col> </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title> Information </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col>
                      <DoughnutChart :chart-data="chartData"></DoughnutChart>
                    </v-col>
                  </v-row>
                  <v-row></v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Items that needs Restocking</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container grid-list-xs>
                  <v-row>
                    <v-col v-for="(item, index) in restockPagination">
                      <v-card
                        :key="index"
                        class="mx-auto"
                        max-width="344"
                        outlined
                      >
                        <v-list-item three-line>
                          <v-list-item-content>
                            <div class="overline mb-4">
                              {{ item.item_name }}
                            </div>
                            <v-list-item-title class="headline mb-1">
                              {{ item.quantity }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.unit }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { useInventoryStore } from "@/store/app";
import { DoughnutChart, LineChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "Dashboard",
  components: {
    DoughnutChart,
    LineChart,
  },
  data() {
    return {
      // Your component's data goes here
      chartData: {
        labels: ["Need Restocking", "Normal"],
        width: 400,
        height: 400,
        datasets: [
          {
            label: "Inventory",
            data: [0, 0],
            backgroundColor: ["#f87979", "#36a2eb"],
            borderColor: ["#f87979", "#36a2eb"],
          },
        ],
      },

      allInventory: [],
      allOrderLevel: [],

      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },
    };
  },

  computed: {
    // Your component's computed properties go here
    filteredInventory() {
      return this.allInventory.slice(
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage,
        this.pagination.currentPage * this.pagination.rowPerPage
      );
    },

    inventoryPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredInventory.slice(start, end);
    },

    filteredRestock() {
      return this.allOrderLevel.slice(
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage,
        this.pagination.currentPage * this.pagination.rowPerPage
      );
    },

    restockPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredRestock.slice(start, end);
    },
  },

  methods: {
    // Your component's methods go here
    async getInventory() {
      try {
        const inventoryStore = useInventoryStore();
        await inventoryStore.getAllInventory();
        this.allInventory = inventoryStore.allInventory;
        this.allInventory.forEach((inventory) => {
          if (inventory.quantity <= inventory.reorder_level) {
            this.allOrderLevel.push(inventory);
          }
        });

        this.setDataChart();

        console.log("allInventory", this.allInventory);
        console.log("allOrderLevel", this.allOrderLevel);
      } catch (error) {
        console.log(error);
      }
    },

    setDataChart() {
      this.chartData.datasets[0].data[0] = this.allOrderLevel.length;
      this.chartData.datasets[0].data[1] =
        this.allInventory.length - this.allOrderLevel.length;
    },
  },
  created() {
    // Code to run when the component is mounted goes here
    this.getInventory();
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>

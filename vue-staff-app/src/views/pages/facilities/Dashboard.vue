<template>
  <v-app>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col> <h1>Dashboard</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Information</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col>
                    <DoughnutChart
                      :chart-data="chartData"
                      :width="chartData.width"
                      :height="chartData.height"
                    ></DoughnutChart>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col></v-col>
                  <v-col>
                    <div>All Rooms:</div>
                    <div class="font-weight-bold text-uppercase">
                      {{ allRooms.length }}
                    </div>
                  </v-col>
                  <v-col>
                    <div>Available Rooms:</div>
                    <div
                      v-if="allAvailableRooms"
                      class="font-weight-bold text-uppercase"
                    >
                      {{ allAvailableRooms.length }}
                    </div>
                  </v-col>
                  <v-col></v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>Available Rooms</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-container>
                <v-row>
                  <v-col
                    v-for="(room, index) in allAvailableRooms"
                    :key="index"
                    cols="auto"
                    sm="6"
                    md="4"
                  >
                    <v-card min-height="200px">
                      <v-toolbar color="primary">
                        <v-toolbar-title>{{
                          room.room_number
                        }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-card-text>
                        <div>
                          <div class="font-weight-bold text-uppercase">
                            Room Type:
                          </div>
                          <div class="text-h6 font-weight-light grey--text">
                            {{ room.type.type_name }}
                          </div>
                        </div>

                        <br />
                        <div>
                          <div class="font-weight-bold text-uppercase">
                            Rate:
                          </div>
                          <div class="text-h6 font-weight-light grey--text">
                            {{ room.type.rate }}
                          </div>
                        </div>

                        <br />
                        <div>
                          <div class="font-weight-bold text-uppercase">
                            Description:
                          </div>
                          <div class="font-weight-light grey--text">
                            {{ room.type.description }}
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>
<script>
import { useFacilityStore, useRoomStore } from "@/store/app";
import { DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "Dashboard",
  components: {
    DoughnutChart,
  },
  data: () => {
    return {
      chartData: {
        labels: ["Occupied", "Available"],
        width: 400,
        height: 400,
        datasets: [
          {
            label: "Rooms",
            data: [0, 0],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      },

      allRooms: [],
      allAvailableRooms: [],
      allRoomTypes: [],
      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },
    };
  },

  computed: {},

  methods: {
    async getRooms() {
      try {
        const roomStore = useRoomStore();
        await roomStore.getRooms();
        await roomStore.getRoomTypes();
        this.allRooms = roomStore.allRooms;
        this.allRoomTypes = roomStore.allRoomTypes;
        console.log("allRooms", this.allRooms);
        console.log("allRoomTypes", this.allRoomTypes);
      } catch (error) {
        console.log(error);
      }
    },

    async getAvailableRooms() {
      try {
        this.allAvailableRooms = this.allRooms.filter(
          (room) => room.is_occupied === 0
        );
        console.log("allAvailableRooms", this.allAvailableRooms);
      } catch (error) {
        console.log(error);
      }
    },

    setChartData() {
      if (this.allRooms.length === 0) {
        this.chartData.datasets[0].data = [0, 0];
        return;
      }

      const occupied = this.allRooms.filter(
        (room) => room.is_occupied === 1
      ).length;
      const available = this.allRooms.filter(
        (room) => room.is_occupied === 0
      ).length;

      this.chartData.datasets[0].data = [occupied, available];
    },
  },

  async created() {
    await this.getRooms();
    this.getAvailableRooms();
    this.setChartData();
  },
};
</script>

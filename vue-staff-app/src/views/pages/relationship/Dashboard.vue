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
                <v-toolbar-title>
                  <h3>Information</h3>
                </v-toolbar-title>
              </v-toolbar>
              <v-container grid-list-xs>
                <v-row>
                  <v-col>
                    <DoughnutChart
                      :chart-data="DoughnutChartData"
                      :width="DoughnutChartData.width"
                      :height="DoughnutChartData.height"
                    ></DoughnutChart>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <LineChart :chart-data="LineChartData"></LineChart>
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
import { useFeedbackStore } from "@/store/app";
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
      LineChartData: {
        labels: [],
        height: 300,
        width: 300,
        datasets: [],
      },

      DoughnutChartData: {
        labels: ["One", "Two", "Three", "Four", "Five"],
        height: 400,
        width: 400,
        datasets: [
          {
            label: "Ratings",
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
            ],
          },
        ],
      },

      allFeedbacks: [],
      allRatingsByTime: [],
      ratings: {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
      },

      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },
    };
  },
  methods: {
    async getAllFeedbacks() {
      try {
        const responseStore = useFeedbackStore();
        await responseStore.getAllFeedback();
        this.allFeedbacks = responseStore.allFeedback;
        this.allFeedbacksCopy = responseStore.allFeedback;

        this.allFeedbacks.forEach((element) => {
          if (element.rating == 1) {
            this.ratings.one++;
          } else if (element.rating == 2) {
            this.ratings.two++;
          } else if (element.rating == 3) {
            this.ratings.three++;
          } else if (element.rating == 4) {
            this.ratings.four++;
          } else if (element.rating == 5) {
            this.ratings.five++;
          }
        });

        console.log("allratings", this.ratings);

        console.log(this.allFeedbacks);

        this.setDoughnutChartData();
        this.groupFeedbackByTimeIntervals();
      } catch (error) {
        console.log(error);
      }
    },

    setDoughnutChartData() {
      if (this.allFeedbacks.length === 0) {
        this.DoughnutChartData.datasets[0].data = [0, 0, 0, 0, 0];
        return;
      }

      const one = this.ratings.one;
      const two = this.ratings.two;
      const three = this.ratings.three;
      const four = this.ratings.four;
      const five = parseInt(this.ratings.five);

      console.log("one", one);
      this.DoughnutChartData.datasets[0].data = [one, two, three, four, five];
    },

    groupFeedbackByTimeIntervals() {
      const feedbacks = this.allFeedbacks;

      const groupedFeedbacks = feedbacks.reduce((acc, feedback) => {
        const date = new Date(feedback.created_at); // Assuming there's a timestamp property in the feedback object

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-indexed, so adding 1 to get the actual month number
        const day = date.getDate();

        const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
          day < 10 ? "0" : ""
        }${day}`; // Formatting the date as YYYY-MM-DD

        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            date: formattedDate,
            ratings: {
              one: 0,
              two: 0,
              three: 0,
              four: 0,
              five: 0,
            },
          };
        }

        feedback.rating == 1
          ? acc[formattedDate].ratings.one++
          : feedback.rating == 2
          ? acc[formattedDate].ratings.two++
          : feedback.rating == 3
          ? acc[formattedDate].ratings.three++
          : feedback.rating == 4
          ? acc[formattedDate].ratings.four++
          : feedback.rating == 5
          ? acc[formattedDate].ratings.five++
          : null;

        // switch (feedback.rating) {
        //   case 1:
        //     acc[formattedDate].ratings.one++;
        //     break;
        //   case 2:
        //     acc[formattedDate].ratings.two++;
        //     break;
        //   case 3:
        //     acc[formattedDate].ratings.three++;
        //     break;
        //   case 4:
        //     acc[formattedDate].ratings.four++;
        //     break;
        //   case 5:
        //     acc[formattedDate].ratings.five++;
        //     break;
        //   default:
        //     break;
        // }

        return acc;
      }, {});

      console.log("groupedFeedbacks", groupedFeedbacks);

      // Convert the object back to an array to be used for the line chart
      const groupedFeedbacksArray = Object.values(groupedFeedbacks);

      console.log(
        "groupedFeedbacksArray",
        groupedFeedbacksArray.map((item) => item.ratings)
      );

      // Sorting the data based on date in case it's not already sorted
      groupedFeedbacksArray.sort((a, b) => new Date(a.date) - new Date(b.date));

      const averageRatings = groupedFeedbacksArray.map((item) => {
        const totalRatings =
          item.ratings.one +
          item.ratings.two +
          item.ratings.three +
          item.ratings.four +
          item.ratings.five;

        const averageRating =
          (item.ratings.one +
            item.ratings.two * 2 +
            item.ratings.three * 3 +
            item.ratings.four * 4 +
            item.ratings.five * 5) /
          totalRatings;

        return averageRating;
      });

      // Prepare data for the LineChart
      const lineChartData = {
        labels: groupedFeedbacksArray.map((item) => item.date),
        datasets: [
          {
            label: "Average Rating",
            data: averageRatings,
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            borderColor: "rgb(153, 102, 255)",
            borderWidth: 1,
          },
          // {
          //   label: "Rating 1",
          //   data: groupedFeedbacksArray.map((item) => item.ratings.one),
          //   backgroundColor: "rgba(255, 99, 132, 0.2)",
          //   borderColor: "rgb(255, 99, 132)",
          //   borderWidth: 1,
          // },
          // {
          //   label: "Rating 2",
          //   data: groupedFeedbacksArray.map((item) => item.ratings.two),
          //   backgroundColor: "rgba(255, 159, 64, 0.2)",
          //   borderColor: "rgb(255, 159, 64)",
          //   borderWidth: 1,
          // },
          // {
          //   label: "Rating 3",
          //   data: groupedFeedbacksArray.map((item) => item.ratings.three),
          //   backgroundColor: "rgba(255, 205, 86, 0.2)",
          //   borderColor: "rgb(255, 205, 86)",
          //   borderWidth: 1,
          // },
          // {
          //   label: "Rating 4",
          //   data: groupedFeedbacksArray.map((item) => item.ratings.four),
          //   backgroundColor: "rgba(75, 192, 192, 0.2)",
          //   borderColor: "rgb(75, 192, 192)",
          //   borderWidth: 1,
          // },
          // {
          //   label: "Rating 5",
          //   data: groupedFeedbacksArray.map((item) => item.ratings.five),
          //   backgroundColor: "rgba(54, 162, 235, 0.2)",
          //   borderColor: "rgb(54, 162, 235)",
          //   borderWidth: 1,
          // },
        ],
      };

      // Set the LineChartData to the grouped data
      this.LineChartData = lineChartData;
    },
  },
  async created() {
    // Code to run when the component is mounted goes here
    this.getAllFeedbacks();
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>

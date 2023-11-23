// Composables
import { createRouter, createWebHistory } from "vue-router";

// views
import loginPage from "@/views/Login.vue";
import dbSettingsPage from "@/views/DbSettings.vue";
import dashboardPage from "@/views/Dashboard.vue";
import NotFound from "@/views/NotFound.vue";
//

// guests
import frontOfficePage from "@/views/pages/FrontOffice.vue";
import foDashboard from "@/views/pages/frontOffice/Dashboard.vue";
import foBookings from "@/views/pages/frontOffice/Booking.vue";
import foReservations from "@/views/pages/frontOffice/Reservation.vue";
import foAccounts from "@/views/pages/frontOffice/Accounts.vue";
import accountCreatePage from "@/views/pages/frontOffice/AccountCreate.vue";
import accountEditPage from "@/views/pages/frontOffice/AccountEdit.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: loginPage,
  },
  {
    name: "dbSettings",
    path: "/dbSettings",
    component: dbSettingsPage,
  },

  {
    path: "/dashboard",
    component: dashboardPage,
    children: [
      {
        path: "frontOffice",
        component: frontOfficePage,
        children: [
          // Tab 1
          {
            path: "FrontOfficeDashboard",
            name: "frontOfficeDashboard",
            component: foDashboard,
          },
          {
            path: "FrontOfficeBooking",
            name: "frontOfficeBooking",
            component: foBookings,
          },
          {
            path: "FrontOfficeReservation",
            name: "frontOfficeReservation",
            props: true,
            require: false,
            component: foReservations,
          },
          {
            path: "FrontOfficeAccounts",
            name: "frontOfficeAccounts",
            component: foAccounts,
          },

          {
            path: "accountCreate",
            name: "accountCreate",
            component: accountCreatePage,
          },
          {
            path: "accountEdit/:id",
            name: "accountEdit",
            props: true,
            component: accountEditPage,
          },
          // Tab 2

          {
            path: "placeholder",
            name: "placeholder",
            component: () => import("@/views/pages/frontOffice/Booking.vue"),
          },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "/:catchAll(.*)",
        component: NotFound,
      },
    ],
  },

  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

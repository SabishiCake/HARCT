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
import gDashboard from "@/views/pages/frontOffice/Dashboard.vue";
import gBookings from "@/views/pages/frontOffice/Booking.vue";
import gReservations from "@/views/pages/frontOffice/Reservation.vue";
import accountsPage from "@/views/pages/frontOffice/Accounts.vue";
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
            path: "",
            name: "gDashboard",
            component: gDashboard,
          },
          {
            path: "bookings",
            name: "bookings",
            component: gBookings,
          },
          {
            path: "reservations",
            name: "reservations",
            component: gReservations,
          },
          {
            path: "accounts",
            name: "accounts",
            component: accountsPage,
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

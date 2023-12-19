// Composables
import { createRouter, createWebHistory } from "vue-router";

// views
import loginPage from "@/views/Login.vue";
import dbSettingsPage from "@/views/DbSettings.vue";
import dashboardPage from "@/views/Dashboard.vue";
import NotFound from "@/views/NotFound.vue";
//

// Front Office and Account Management
import frontOfficePage from "@/views/pages/FrontOffice.vue";
import foDashboard from "@/views/pages/frontOffice/Dashboard.vue";
import foBookings from "@/views/pages/frontOffice/Booking.vue";
import foReservations from "@/views/pages/frontOffice/Reservation.vue";
import foOrders from "@/views/pages/frontOffice/Orders.vue";
import foBilling from "@/views/pages/frontOffice/Billing.vue";
import foAccounts from "@/views/pages/frontOffice/Accounts.vue";
import accountCreatePage from "@/views/pages/frontOffice/AccountCreate.vue";
import accountEditPage from "@/views/pages/frontOffice/AccountEdit.vue";

// Housekeeping And Laundry
import housekeepingPage from "@/views/pages/Housekeeping.vue";
import hkDashboard from "@/views/pages/housekeeping/Dashboard.vue";
import hkTask from "@/views/pages/housekeeping/Task.vue";

// Room And Facility
import facilityPage from "@/views/pages/Facilities";
import fDashboard from "@/views/pages/facilities/Dashboard.vue";
import facilities from "@/views/pages/facilities/Facility.vue";
import rooms from "@/views/pages/facilities/Rooms.vue";
import roomType from "@/views/pages/facilities/RoomType.vue";

// Inventory Management
import inventoryPage from "@/views/pages/Inventory.vue";
import iDashboard from "@/views/pages/inventory/Dashboard.vue";
import iStock from "@/views/pages/inventory/Stock.vue";
import iSupplier from "@/views/pages/inventory/Supplier.vue";

// Relationship Management
import relationshipPage from "@/views/pages/Relationship.vue";
import rDashboard from "@/views/pages/relationship/Dashboard.vue";
import rFeedback from "@/views/pages/relationship/Feedback.vue";

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
            path: "FrontOfficeOrders",
            name: "frontOfficeOrders",
            component: foOrders,
          },
          {
            path: "FrontOfficeBilling",
            name: "frontOfficeBilling",
            props: true,
            component: foBilling,
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
            path: "accountEdit",
            name: "accountEdit",
            component: accountEditPage,
          },
          // Tab 2

          // {
          //   path: "placeholder",
          //   name: "placeholder",
          //   component: () => import("@/views/pages/frontOffice/Booking.vue"),
          // },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "/housekeeping",
        component: housekeepingPage,
        children: [
          {
            path: "HousekeepingDashboard",
            name: "housekeepingDashboard",
            component: hkDashboard,
          },
          {
            path: "HousekeepingTask",
            name: "housekeepingTask",
            component: hkTask,
          },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "/facility",
        component: facilityPage,
        children: [
          {
            path: "FacilityDashboard",
            name: "facilityDashboard",
            component: fDashboard,
          },
          {
            path: "Facilities",
            name: "facilities",
            component: facilities,
          },
          {
            path: "Rooms",
            name: "rooms",
            component: rooms,
          },
          {
            name: "RoomType",
            path: "roomType",
            component: roomType,
          },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "/inventory",
        component: inventoryPage,
        children: [
          {
            path: "InventoryDashboard",
            name: "inventoryDashboard",
            component: iDashboard,
          },
          {
            path: "InventoryStock",
            name: "inventoryStock",
            component: iStock,
          },
          {
            path: "InventorySupplier",
            name: "inventorySupplier",
            component: iSupplier,
          },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "/relationship",
        component: relationshipPage,
        children: [
          {
            path: "RelationshipDashboard",
            name: "relationshipDashboard",
            component: rDashboard,
          },
          {
            path: "RelationshipFeedback",
            name: "relationshipFeedback",
            component: rFeedback,
          },
          {
            path: "/:catchAll(.*)",
            component: NotFound,
          },
        ],
      },
      {
        path: "Settings",
        name: "Settings",
        component: dbSettingsPage,
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
  history: createWebHistory(),
  routes,
});

export default router;

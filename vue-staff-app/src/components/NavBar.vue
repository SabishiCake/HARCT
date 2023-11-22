<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item nav>
        <v-avatar size="40">
          <img src="@/assets/logo.svg" alt="Logo" />
        </v-avatar>
        <template v-slot:append>
          <v-btn
            color="primary"
            class="rotate-icon"
            variant="text"
            :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>
      <v-divider color="primary"></v-divider>

      <v-list density="compact" nav>
        <v-list-item nav>
          <v-list-item-content>
            <v-list-item-title>Front Office</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-book-account"
          title="Booking"
          value="booking"
          to="/dashboard/booking"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-book-clock-outline"
          title="Reservation"
          value="reservation"
          to="/dashboard/reservation"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group-outline "
          title="Guest Management"
          value="Guest"
          to="/dashboard/guest/accounts"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item nav>
          <v-list-item-content>
            <v-list-item-title>Kitchen And Bar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-food"
          title="Orders"
          value="Orders"
          to="/dashboard/kitchen-bar/orders"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-truck-cargo-container"
          title="Inventory"
          value="Inventory"
          to="/dashboard/kitchen-bar/inventory"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cash"
          title="Costing"
          value="Costing"
          to="/dashboard/kitchen-bar/costing"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item nav>
          <v-list-item-content>
            <v-list-item-title>Housekeeping & Laundry</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="HousekeepingDashboard"
          to="/dashboard/Housekeeping/dashboard"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-bed"
          title="Rooms And Facilities"
          value="Rooms"
          to="/dashboard/Housekeeping/rooms"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cash"
          title="Billing"
          value="Billing"
          to="/dashboard/Housekeeping/billing"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Management"
          value="Management"
          to="/dashboard/Housekeeping/Management"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item nav>
          <v-list-item-content>
            <v-list-item-title>Supplier Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="supplierDashboard"
          to="/dashboard/supplier/dashboard"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-truck-alert"
          title="Inventory"
          value="supplierInventory"
          to="/dashboard/supplier/inventory"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-truck-check"
          title="Inventory"
          value="supplierInventory"
          to="/dashboard/supplier/supplier"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item nav>
          <v-list-item-content>
            <v-list-item-title>Analytics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-if="!isLoading"
          prepend-icon="mdi-logout"
          title="Logout"
          @click="logout"
        ></v-list-item>
        <v-list-item v-else>
          <v-progress-linear
            color="primary"
            height="4"
            indeterminate
          ></v-progress-linear>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { useLoginStore } from "@/store/auth";
export default {
  data() {
    return {
      drawer: true,
      rail: true,
      isLoading: false,
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
        { title: "Account", icon: "mdi-account", to: "/dashboard/account" },
        { title: "Room", icon: "mdi-bed", to: "/dashboard/room" },
        {
          title: "Reservation",
          icon: "mdi-book",
          to: "/dashboard/reservation",
        },
        {
          title: "Booking",
          icon: "mdi-book-account",
          to: "/dashboard/booking",
        },
        { title: "Guest", icon: "mdi-account-group", to: "/dashboard/guest" },
        {
          title: "Kitchen & Bar",
          icon: "mdi-food",
          to: "/dashboard/kitchen-bar",
        },
        {
          title: "Housekeeping",
          icon: "mdi-view-dashboard",
          to: "/dashboard/Housekeeping",
        },
        {
          title: "Supplier",
          icon: "mdi-truck-check",
          to: "/dashboard/supplier",
        },
        {
          title: "Analytics",
          icon: "mdi-chart-bar",
          to: "/dashboard/analytics",
        },
        { title: "Logout", icon: "mdi-logout", to: "/dashboard/logout" },
      ],
    };
  },
  methods: {
    async logout() {
      try {
        this.isLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const loginStore = useLoginStore();
        loginStore.logout();
        await this.$router.push("/");
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 260px;
}

/* Adjust the logo styles */
.v-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Set a fixed width */
  height: 40px; /* Set a fixed height */
}

.v-avatar img {
  width: 100%; /* Ensure the image takes the full width of the avatar container */
  height: 100%; /* Ensure the image takes the full height of the avatar container */
}

/* Define the rotation for the icon */
.rotate-icon .v-icon {
  transition: transform 0.3s ease; /* Add a transition effect for smooth rotation */
}

.rotate-icon .v-icon.rotate180 {
  transform: rotate(180deg); /* Rotate the icon by 180 degrees */
}

.v-list-item__title {
  font-size: 14px;
}
</style>

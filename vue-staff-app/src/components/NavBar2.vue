<template>
  <div>
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
        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="item in itemList"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :on-click="item.onClick"
            :disabled="rail"
            link
            class="px-2 py-1"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-if="!isLoading"
            prepend-icon="mdi-logout"
            title="Logout"
            @click="logout"
            :disabled="rail"
          >
          </v-list-item>
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
  </div>

  <div>
    <v-dialog
      v-model="dialog.model"
      scrollable
      fullscreen
      persistent
      :overlay="true"
      max-width="500px"
      min-width="100px"
      transition="dialog-top-transition"
    >
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-toolbar
            color="primary"
            dark
            flat
            fixed
            app
            :clipped-left="isActive"
          >
            <v-btn icon @click="dialog.model = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <div>
              <p>{{ dialog.text }}</p>
            </div>
            <br />

            <div>
              <v-container grid-list-xs>
                <v-row>
                  <v-col
                    ><v-btn color="success" block @click="confirmLogout"
                      >Yes</v-btn
                    ></v-col
                  >
                  <v-col
                    ><v-btn color="error" block @click="dialog.model = false"
                      >No</v-btn
                    ></v-col
                  >
                </v-row>
              </v-container>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
import { useLoginStore } from "@/store/auth";
export default {
  data() {
    return {
      drawer: true,
      rail: true,
      isLoading: false,
      dialog: {
        model: false,
        title: "Confirmation",
        text: "",
      },

      itemList: [
        {
          title: "Front Office",
          icon: "mdi-laptop",
          to: {
            name: "frontOfficeDashboard",
          },
          onClick: () => {
            this.$emit("changeTitle", "Front Office");
          },
        },
        {
          title: "Kitchen And Bar",
          icon: "mdi-food",
          to: "/dashboard/KitchenAndBar",
          onClick: () => {
            this.$emit("changeTitle", "Kitchen And Bar");
          },
        },
        {
          title: "Housekeeping And Laundry",
          icon: "mdi-room-service-outline",
          to: "/dashboard/HousekeepingAndLaundry",
          onClick: () => {
            this.$emit("changeTitle", "Housekeeping And Laundry");
          },
        },
        {
          title: "Supplier Management",
          icon: "mdi-truck",
          to: "/dashboard/SupplierManagement",
          onClick: () => {
            this.$emit("changeTitle", "Supplier Management");
          },
        },
        {
          title: "Resto Analytics",
          icon: "mdi-account-group-outline",
          to: "/dashboard/RestoAnalytics",
          onClick: () => {
            this.$emit("changeTitle", "Resto Analytics");
          },
        },
      ],
    };
  },
  methods: {
    async logout() {
      try {
        this.dialog.model = true;
        this.dialog.text = "Are you sure you want to logout?";
      } catch (error) {
        console.log(error);
      }
    },

    async confirmLogout() {
      try {
        this.isLoading = true;
        useLoginStore().logout();
        this.$router.push({
          name: "login",
        });
      } catch (error) {
        console.log(error);
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

.v-list-item__title .rotate-icon .v-icon.rotate180 {
  transform: rotate(180deg); /* Rotate the icon by 180 degrees */
}

.v-list-item__title {
  font-size: 14px;
}
</style>

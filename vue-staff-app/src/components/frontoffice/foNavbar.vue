<template>
  <div>
    <v-card>
      <v-navigation-drawer
        v-model="navbar.drawer"
        :rail="navbar.rail"
        permanent
        @click="navbar.rail = false"
      >
        <v-list-item nav>
          <template v-slot:append>
            <v-btn
              color="primary"
              class="rotate-icon"
              variant="text"
              :icon="navbar.rail ? 'mdi-menu' : 'mdi-menu-open'"
              @click.stop="navbar.rail = !navbar.rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>
        <v-list>
          <v-list-item
            v-for="item in itemList"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :on-click="item.onClick"
            :disabled="navbar.rail || item.disabled"
            link
            class="px-2 py-1"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "foNavbar",
  data() {
    return {
      navbar: {
        drawer: true,
        rail: true,
      },

      itemList: [
        {
          title: "Account",
          icon: "mdi-account",
          action: () => {
            this.$emit("goto", 0);
          },
        },
      ],
    };
  },
  methods: {},
};
</script>

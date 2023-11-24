<template>
  <v-app>
    <!-- <NavBar /> -->
    <NavBar2 />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import NavBar from "@/components/NavBar.vue";
import NavBar2 from "@/components/NavBar2.vue";
export default {
  name: "App",
  components: {
    // NavBar,
    NavBar2,
  },
};
</script>

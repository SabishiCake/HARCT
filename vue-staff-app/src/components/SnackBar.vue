<template>
  <!-- Notification -->
  <v-snackbar v-model="model" :timeout="timeout" :color="color">
    {{ text }}
    <template v-slot:actions>
      <v-btn color="white" text @click="model = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "error",
    },
    timeout: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      model: false,
    };
  },
};
</script>

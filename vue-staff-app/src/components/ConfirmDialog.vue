<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-btn @click="confirmAction(false)">Cancel</v-btn>
        <v-btn @click="confirmAction(true)">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Confirm Action",
    },
    message: {
      type: String,
      default: "Are you sure you want to proceed?",
    },
    confirmCallback: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    confirmAction(confirmed) {
      this.$emit("input", false); // Close the dialog
      this.confirmCallback(confirmed);
    },
  },
};
</script>

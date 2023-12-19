<template>
  <div>
    <v-dialog v-model="model" max-width="500px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Payment Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import apiHandler from "@/services/apiHandler";
import { usePaymentStore } from "@/store/app";
export default {
  props: {
    refTransId: {
      // This is the reference transaction id
      type: String,
    },
  },
  data() {
    return {
      model: false,
      data: null,
      loading: false,
    };
  },

  methods: {
    async getPayment() {
      const paymentStore = usePaymentStore();
      await paymentStore.getPaymentByRefTransId(this.refTransId);
    },
  },

  async created() {
    await this.getPayment();
  },
};
</script>

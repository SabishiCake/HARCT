<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Billing</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container>
        <v-row>
          <v-col>
            <v-container>
              <v-row>
                <v-col>
                  <v-card>
                    <v-toolbar color="primary">
                      <v-toolbar-title>
                        <v-icon>mdi-cash</v-icon>
                        Billing Information
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <v-form v-model="form" v-if="paymentData">
                        <!-- payment_id, created_at, updated_at, guest_id, amount, payment_date, payment_status, type, method, reftransaction_id -->
                        <v-container grid-list-xs>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.first_name"
                                readonly
                                class="mb-2"
                                label="First Name"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.last_name"
                                readonly
                                class="mb-2"
                                label="Last Name"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.reftransaction_id"
                                readonly
                                class="mb-2"
                                label="Ref Transaction ID"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.payment_id"
                                readonly
                                class="mb-2"
                                label="Payment ID"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.guest_id"
                                readonly
                                class="mb-2"
                                label="Guest ID"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.created_at"
                                readonly
                                class="mb-2"
                                label="Created At"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.updated_at"
                                readonly
                                class="mb-2"
                                label="Updated At"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.amount"
                                readonly
                                class="mb-2"
                                label="Amount"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.payment_date"
                                readonly
                                class="mb-2"
                                label="Must be paid on"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.payment_status"
                                readonly
                                class="mb-2"
                                label="Current Payment Status"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field
                                v-model="paymentData.type"
                                readonly
                                class="mb-2"
                                label="Type"
                              ></v-text-field>
                            </v-col>
                            <v-col>
                              <v-select
                                v-model="SelectedMethod"
                                :items="[
                                  'pending',
                                  'cash',
                                  'credit Card',
                                  'debit Card',
                                  'other',
                                ]"
                                label="Payment Method"
                                return-object
                              >
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row v-if="SelectedMethod === 'other'">
                            <v-col>
                              <v-text-field
                                color="primary"
                                v-model="OtherMethod"
                                class="mb-2"
                                label="Other"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                              <v-btn
                                color="success"
                                @click="updatePaymentData"
                                class="mr-4"
                                block
                              >
                                Update
                              </v-btn>
                            </v-col>
                            <v-col>
                              <v-btn color="primary" block>Cancel</v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { useAccountStore, usePaymentStore } from "@/store/app";
import apiHandler from "@/services/apiHandler";
export default {
  name: "Billing",

  data() {
    return {
      form: false,
      paymentData: {
        payment_id: null,
        created_at: null,
        updated_at: null,
        guest_id: null,
        amount: null,
        payment_date: null,
        payment_status: null,
        type: null,
        method: null,
        reftransaction_id: null,
      },

      SelectedMethod: null,
      OtherMethod: null,
    };
  },

  watch: {
    SelectedMethod: function (val) {
      if (val === "other") {
        this.paymentData.method = this.OtherMethod;
        console.log("OTHER METHOD", this.paymentData.method);
      } else {
        this.paymentData.method = val;
      }
    },

    OtherMethod: function (val) {
      this.paymentData.method = val;
    },
  },

  methods: {
    // Your component's methods go here

    formatDate(date) {
      const newdate = new Date(date);
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        // hour: "numeric",
        // minute: "numeric",
        // second: "numeric",
        // timeZoneName: "short",
      };

      const readableDate = newdate.toLocaleDateString("en-US", options);
      return readableDate;
    },

    parseFormattedDate(formattedDate) {
      const dateObject = new Date(formattedDate); // Parsing the formatted date string

      // Convert the date object to ISO string format
      const revertedDate = dateObject.toISOString();

      return revertedDate;
    },

    async resetFields() {
      this.paymentData = {
        payment_id: null,
        created_at: null,
        updated_at: null,
        guest_id: null,
        amount: null,
        payment_date: null,
        payment_status: null,
        type: null,
        method: null,
        reftransaction_id: null,
      };
    },

    async getPaymentData() {
      try {
        const paymentStore = usePaymentStore();
        const id = paymentStore.refTransactionId;
        if (!id) {
          return;
        }
        this.form = true;
        console.log("REF TRANSACTION ID", id);
        await paymentStore.getPaymentByRefTransId(id);
        const paymentData = paymentStore.payment;

        this.paymentData = {
          guest_id: paymentData.guest_id,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          payment_id: paymentData.payments[0].payment_id,
          reftransaction_id: paymentData.payments[0].reftransaction_id,
          created_at: this.formatDate(paymentData.payments[0].created_at),
          updated_at: this.formatDate(paymentData.payments[0].updated_at),
          amount: paymentData.payments[0].amount,
          payment_date: this.formatDate(paymentData.payments[0].payment_date),
          payment_status: paymentData.payments[0].payment_status,
          type: paymentData.payments[0].type,
          method: paymentData.payments[0].payment_method,
        };

        this.SelectedMethod = this.paymentData.method;

        console.log("BILLING DATA", paymentData);
        console.log("NEW BILLING DATA", this.paymentData);
      } catch (error) {
        console.log(error);
      }
    },

    async updatePaymentData() {
      try {
        if (
          !confirm("Are you sure you want to update this billing information?")
        ) {
          return;
        }
        const reftransaction_id = this.paymentData.reftransaction_id;
        const requestBody = {
          guest_id: this.paymentData.guest_id,
          amount: this.paymentData.amount,
          payment_date: this.parseFormattedDate(this.paymentData.payment_date),
          payment_status: "paid",
          type: this.paymentData.type,
          payment_method: this.paymentData.method,
        };

        apiHandler
          .put(`payments/refTransId/${reftransaction_id}`, requestBody)
          .then(
            (response) => {
              console.log("RESPONSE", response);
            },
            (error) => {
              console.log("ERROR", error);
            }
          );

        apiHandler.put(`roomres/checkedin/${reftransaction_id}`).then(
          (response) => {
            console.log("RESPONSE", response);
          },
          (error) => {
            console.log("ERROR", error);
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    // Code to run when the component is mounted goes here
    this.getPaymentData();
  },
};
</script>

<style scoped>
/* Your component's styles go here */
</style>

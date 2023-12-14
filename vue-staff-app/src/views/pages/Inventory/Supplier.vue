<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Supplier Management</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-container grid-list-xs fluid>
              <v-row>
                <v-col cols="10">
                  <v-text-field
                    v-model="supplierSearch"
                    label="Search"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="success"
                    text
                    @click="openNewSupplierDialog"
                    block
                    >Add New</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-toolbar color="primary">
                      <v-toolbar-title>Supplier List</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>

                    <v-container grid-list-xs>
                      <v-row>
                        <v-col v-if="supplierPagination === 0">
                          <div class="text-h6">
                            <span> No supplierStore Found</span>
                          </div>
                        </v-col>

                        <v-col
                          v-for="(supplier, index) in supplierPagination"
                          :key="index"
                          cols="auto"
                          sm="6"
                          md="4"
                        >
                          <v-card>
                            <v-toolbar color="primary">
                              <v-toolbar-title>
                                {{ supplier.supplier_name }}
                              </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text>
                              <div>
                                <span>Supplier ID: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ supplier.supplier_id }}</span
                                >
                              </div>
                              <br />
                              <div>
                                <span>Contact Name: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ supplier.contact_name }}</span
                                >
                              </div>
                              <br />
                              <div>
                                <span>Contact Title: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ supplier.contact_title }}</span
                                >
                              </div>
                              <!-- <div>
                                <span>Supplier ID: </span>
                                <span>{{ supplier.supplier_id }}</span>
                              </div>
                              <div>
                                <span>Contact Name: </span>
                                <span>{{ supplier.contact_name }}</span>
                              </div>
                              <div>
                                <span>Contact Title: </span>
                                <span>{{ supplier.contact_title }}</span>
                              </div> -->
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-container grid-list-xs>
                                <v-row>
                                  <v-col>
                                    <v-btn
                                      color="success"
                                      text
                                      prepend-icon="mdi-pencil"
                                      @click="openEditDialog(supplier)"
                                      block
                                    >
                                      Edit
                                    </v-btn>
                                  </v-col>
                                  <v-col>
                                    <v-btn
                                      color="primary"
                                      text
                                      prepend-icon="mdi-eye"
                                      @click="viewSupplier(supplier)"
                                      block
                                    >
                                      View
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-pagination
                            v-model="pagination.currentPage"
                            :length="
                              Math.ceil(
                                filteredSuppliers.length / pagination.rowPerPage
                              )
                            "
                          ></v-pagination>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-dialog
        v-model="dialog.model"
        max-width="500px"
        persistent
        content-class="rounded"
        scrollable
      >
        <v-card>
          <v-toolbar color="primary" dark>
            <v-btn icon dark @click="dialog.model = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn color="primary" text @click="dialog.model = false" block
                >Close</v-btn
              >
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-form
              ref="form"
              v-model="form"
              lazy-validation
              class="px-3"
              @submit.prevent="onSubmit"
            >
              <v-container grid-list-xs>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.supplier_name"
                      :readonly="dialog.isView"
                      label="Supplier Name"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.contact_name"
                      :readonly="dialog.isView"
                      label="Contact Name"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.contact_title"
                      label="Contact Title"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.address"
                      :readonly="dialog.isView"
                      label="Address"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.city"
                      :readonly="dialog.isView"
                      label="City"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.region"
                      :readonly="dialog.isView"
                      label="Region"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.postal_code"
                      :readonly="dialog.isView"
                      label="Postal Code"
                      :rules="[rules.required, rules.postal_code]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.country"
                      :readonly="dialog.isView"
                      label="Country"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.phone"
                      :readonly="dialog.isView"
                      label="Phone"
                      :rules="[rules.required, rules.phone]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="supplierData.email"
                      :readonly="dialog.isView"
                      label="Email"
                      :rules="[rules.required, rules.email]"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-container grid-list-xs>
              <v-row>
                <v-col>
                  <v-btn
                    color="success"
                    text
                    type="submit"
                    block
                    :disabled="dialog.isView || !form"
                    @click="dialog.isNew ? addSupplier() : updateSupplier()"
                    >{{ dialog.isNew ? "Add" : "Update" }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <SnackBar
        ref="SnackBar"
        :text="snackbar.text"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
      ></SnackBar>
    </div>
  </v-app>
</template>

<script>
import { useSupplierStore } from "@/store/app";
import apiHandler from "@/services/apiHandler";
import SnackBar from "@/components/SnackBar.vue";

export default {
  name: "Supplier",
  components: {
    SnackBar,
  },
  data() {
    return {
      // Your component's data goes here
      pagination: {
        currentPage: 1,
        rowPerPage: 6,
      },

      form: false,
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          if (!value) return true;
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        phone: (value) => {
          if (!value) return true;
          const pattern = /^[0-9]+$/;
          return pattern.test(value) || "Invalid phone number.";
        },
        postal_code: (value) => {
          if (!value) return true;
          // Pattern: [a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$ (case insensitive)
          // This is just for sanity check, not a full validation
          const pattern = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i;
          return pattern.test(value) || "Invalid postal code.";
        },
      },

      snackbar: {
        model: false,
        timeout: 3000,
        text: "",
        color: "",
      },

      dialog: {
        isNew: false,
        isView: false,
        isEdit: false,
        item: {},
        model: false,
        title: "",
      },

      supplierSearch: "",
      allSuppliersData: [],
      supplierData: {
        supplier_id: "",
        supplier_name: "",
        contact_name: "",
        contact_title: "",
        address: "",
        city: "",
        region: "",
        postal_code: "",
        country: "",
        phone: "",
        email: "",
      },
    };
  },

  computed: {
    filteredSuppliers() {
      const searchTerm = this.supplierSearch.toLowerCase();

      return this.allSuppliersData.filter((supplier) => {
        return Object.keys(supplier).some((key) => {
          return String(supplier[key]).toLowerCase().includes(searchTerm);
        });
      });
    },

    supplierPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredSuppliers.slice(start, end);
    },
  },

  methods: {
    async getAllSuppliers() {
      try {
        const supplierStore = useSupplierStore();
        await supplierStore.getAllSuppliers();
        this.allSuppliersData = supplierStore.allSuppliers.map((supplier) => {
          return {
            supplier_id: supplier.supplier_id,
            supplier_name: supplier.supplier_name,
            contact_name: supplier.contact_name,
            contact_title: supplier.contact_title,
            address: supplier.address,
            city: supplier.city,
            region: supplier.region,
            postal_code: supplier.postal_code,
            country: supplier.country,
            phone: supplier.phone,
            email: supplier.email,
          };
        });
        console.log(this.allSuppliersData);
      } catch (error) {
        console.log(error);
      }
    },

    onSubmit() {
      if (!this.form) return;
      try {
        this.addSupplier();
      } catch (error) {
        console.log(error);
      }
    },

    viewSupplier(supplier) {
      try {
        this.dialog.isView = true;
        this.dialog.title = "View Supplier";
        this.dialog.model = true;
        this.supplierData = supplier;
      } catch (error) {
        console.log(error);
      }
    },

    openNewSupplierDialog() {
      try {
        this.dialog.isNew = true;
        this.dialog.isView = false;
        this.dialog.title = "Add New Supplier";
        this.dialog.model = true;
        this.supplierData = {
          supplier_id: "",
          supplier_name: "",
          contact_name: "",
          contact_title: "",
          address: "",
          city: "",
          region: "",
          postal_code: "",
          country: "",
          phone: "",
          email: "",
        };
      } catch (error) {
        console.log(error);
      }
    },

    openEditDialog(supplier) {
      try {
        this.dialog.isEdit = true;
        this.dialog.isView = false;
        this.dialog.isNew = false;
        this.dialog.title = "Edit Supplier";
        this.dialog.model = true;
        this.supplierData = supplier;
      } catch (error) {
        console.log(error);
      }
    },

    async updateSupplier() {
      try {
        if (!confirm("Are you sure you want to update this supplier?")) return;

        const req = {
          supplier_name: this.supplierData.supplier_name,
          contact_name: this.supplierData.contact_name,
          contact_title: this.supplierData.contact_title,
          address: this.supplierData.address,
          city: this.supplierData.city,
          region: this.supplierData.region,
          postal_code: this.supplierData.postal_code,
          country: this.supplierData.country,
          phone: this.supplierData.phone,
          email: this.supplierData.email,
        };

        // apiHandler
        //   .put(`suppliers/${this.supplierData.supplier_id}`, req)
        //   .then((res) => {
        //     console.log(res);
        //     this.getAllSuppliers();
        //     this.dialog.model = false;
        //   });

        const res = await apiHandler.put(
          `suppliers/${this.supplierData.supplier_id}`,
          req
        );

        if (res.status === 200) {
          this.getAllSuppliers();
          this.dialog.model = false;
          this.$refs.SnackBar.model = true;
          this.snackbar.text = "Supplier updated successfully";
          this.snackbar.color = "success";
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addSupplier() {
      try {
        if (!confirm("Are you sure you want to add this supplier?")) return;
        const req = {
          supplier_name: this.supplierData.supplier_name,
          contact_name: this.supplierData.contact_name,
          contact_title: this.supplierData.contact_title,
          address: this.supplierData.address,
          city: this.supplierData.city,
          region: this.supplierData.region,
          postal_code: this.supplierData.postal_code,
          country: this.supplierData.country,
          phone: this.supplierData.phone,
          email: this.supplierData.email,
        };
        // const res = await apiHandler.post("suppliers", req);

        const res = await apiHandler.post(
          `suppliers/${this.supplierData.supplier_id}`,
          req
        );

        if (res.status === 200) {
          this.getAllSuppliers();
          this.dialog.model = false;
          this.$refs.SnackBar.model = true;
          this.snackbar.text = "Supplier added successfully";
          this.snackbar.color = "success";
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    // Code to run when the component is mounted goes here
    await this.getAllSuppliers();
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>

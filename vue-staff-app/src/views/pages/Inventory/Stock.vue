<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Inventory Stocks</h1></v-col>
        </v-row>
      </v-container>
    </div>
    <div>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-container grid-list-xs>
              <v-row>
                <v-col cols="10">
                  <v-text-field
                    v-model="inventorySearch"
                    label="Search"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="success"
                    text
                    @click="openNewInventoryDialog"
                    block
                    >Add New</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox
                    v-model="filter.belowOrderLevelOnly"
                    label="Show below reorder level only"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-toolbar color="primary">
                      <v-toolbar-title>Inventory List</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn icon @click="refresh">
                          <v-icon>mdi-refresh</v-icon>
                          <v-tooltip bottom activator="parent">
                            <span>Refresh</span>
                          </v-tooltip>
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-container grid-list-xs>
                      <v-row>
                        <v-col v-if="inventoryPagination === 0">
                          <div class="text-h6">
                            <span> No items Found</span>
                          </div>
                        </v-col>
                        <v-col
                          v-for="(inventory, index) in inventoryPagination"
                          :key="index"
                          cols="auto"
                          sm="6"
                          md="4"
                        >
                          <v-card>
                            <v-toolbar
                              v-if="checkReorderLevel(inventory)"
                              color="warning"
                            >
                              <v-toolbar-title>{{
                                inventory.item_name
                              }}</v-toolbar-title>
                              <v-spacer></v-spacer>
                              <v-toolbar-items>
                                <v-btn icon>
                                  <v-icon>mdi-alert-circle-outline</v-icon>
                                  <v-tooltip bottom activator="parent">
                                    <span>Quantity is below Reorder Level</span>
                                  </v-tooltip>
                                </v-btn>
                              </v-toolbar-items>
                            </v-toolbar>

                            <v-toolbar v-else color="primary">
                              <v-toolbar-title>{{
                                inventory.item_name
                              }}</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                              <div>
                                <span>Description: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.description }}</span
                                >
                              </div>
                              <br />
                              <div>
                                <span>Quantity: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.quantity }}
                                </span>
                                <span v-if="checkReorderLevel(inventory)">
                                  <p style="font-size: 10px; color: red">
                                    WARNING (Below Reorder Level)
                                  </p>
                                </span>
                              </div>
                              <br />
                              <div>
                                <span>Reorder Level: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.reorder_level }}</span
                                >
                              </div>
                              <br />
                              <div>
                                <span>Unit Price: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.unit_price }}</span
                                >
                              </div>

                              <br />

                              <div>
                                <span>Item ID: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.item_id }}</span
                                >
                              </div>
                              <br />

                              <div>
                                <span>Supplier ID: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ inventory.refsupplier_id }}</span
                                >
                              </div>

                              <br />
                              <div>
                                <span>Suppliers Name: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{
                                    inventory.supplier_name
                                      ? inventory.supplier_name
                                      : "Supplier not found"
                                  }}
                                </span>
                              </div>
                            </v-card-text>
                            <v-divider></v-divider>

                            <v-card-actions>
                              <v-container grid-list-xs>
                                <v-row>
                                  <v-col>
                                    <v-btn
                                      color="success"
                                      text
                                      block
                                      prepend-icon="mdi-pencil"
                                      @click="
                                        openEditInventoryDialog(inventory)
                                      "
                                      >Edit</v-btn
                                    >
                                  </v-col>
                                  <v-col>
                                    <v-btn
                                      color="primary"
                                      text
                                      block
                                      prepend-icon="mdi-eye"
                                      @click="
                                        openViewInventoryDialog(inventory)
                                      "
                                      >View</v-btn
                                    >
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
                            :length="Math.ceil(filteredInventory.length / 6)"
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
            <v-btn icon dark @click="closeDialog">
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
            <v-form ref="form" v-model="form" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.item_name"
                      label="Item Name"
                      dense
                      :readonly="dialog.isView"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.description"
                      label="Description"
                      dense
                      :readonly="dialog.isView"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.quantity"
                      label="Quantity"
                      dense
                      :readonly="dialog.isView"
                      :rules="[rules.required, rules.number]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.reorder_level"
                      label="Reorder Level"
                      dense
                      :readonly="dialog.isView"
                      :rules="[rules.required, rules.number]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.unit_price"
                      label="Unit Price"
                      dense
                      :readonly="dialog.isView"
                      :rules="[rules.required, rules.price]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="inventory.refsupplier_id"
                      label="Supplier ID (read only)"
                      dense
                      readonly
                      :rules="[rules.required, rules.number]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select
                      :items="itemSelection"
                      v-model="selectedSupplier"
                      :readonly="dialog.isView"
                      :rules="[rules.required]"
                      label="Supplier"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions v-if="!dialog.isView">
            <v-container grid-list-xs>
              <v-divider></v-divider>
              <v-row>
                <v-col v-if="dialog.isNew" class="text-center">
                  <v-btn
                    color="success"
                    text
                    type="submit"
                    block
                    @click="onSubmit()"
                    :disabled="dialog.isView || !form"
                    >Add</v-btn
                  >
                </v-col>

                <v-col v-if="dialog.isEdit" class="text-center">
                  <v-btn
                    color="success"
                    text
                    type="submit"
                    block
                    :disabled="dialog.isView || !form"
                    @click="updateItemInventory()"
                    >Update</v-btn
                  >
                </v-col>
                <v-col v-if="dialog.isEdit">
                  <v-btn
                    color="error"
                    text
                    block
                    @click="deleteInventory(inventory)"
                    >Delete</v-btn
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
import { useInventoryStore, useSupplierStore } from "@/store/app";
import apiHandler from "@/services/apiHandler";
import SnackBar from "@/components/SnackBar.vue";
export default {
  name: "Stock",
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
        number: (value) => !isNaN(value) || "Must be a number",
        price: (value) => value > 0 || "Must be greater than 0",
        supplier: (value) => {
          // check if supplier exists
          const supplier = this.allSuppliersItems.find((supplier) => {
            if (supplier.name === value) {
              return supplier;
            }
          });
          if (supplier) {
            return true;
          } else {
            return "Supplier not found";
          }
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

      filter: {
        belowOrderLevelOnly: false,
      },

      inventorySearch: "",
      allInventory: [],
      inventory: {
        item_id: "",
        item_name: "",
        description: "",
        quantity: "",
        reorder_level: "",
        unit_price: "",
        refsupplier_id: "",
        supplier_name: "",
      },

      allSuppliers: [],
      // allSuppliersItems: {
      //   name: [],
      //   id: [],
      // },
      allSuppliersItems: [],
      selectedSupplier: "",
      itemSelection: [],
    };
  },

  watch: {
    selectedSupplier: function (val) {
      this.inventory.refsupplier_id = this.getMatchingSupplierIdfromName(val);
      console.log(
        "STOCK | selectedSupplier | inventory.refsupplier_id",
        this.inventory.refsupplier_id,
        val
      );
    },

    "filter.belowOrderLevelOnly": function (val) {
      this.getAllInventory();
    },
  },

  computed: {
    filteredInventory() {
      const searchTerm = this.inventorySearch.toLowerCase();
      if (this.allInventory.length === 0) return [];
      return this.allInventory.filter((inventory) => {
        return Object.keys(inventory).some((key) => {
          return inventory[key].toString().toLowerCase().includes(searchTerm);
        });
      });
    },

    inventoryPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredInventory.slice(start, end);
    },
  },

  methods: {
    // Your component's methods go here

    checkReorderLevel(inventory) {
      if (inventory.quantity <= inventory.reorder_level) {
        return true;
      } else {
        return false;
      }
    },

    refresh() {
      try {
        this.getAllInventory();
        this.snackbar.text = "Refreshed";
        this.snackbar.color = "success";
        this.$refs.SnackBar.model = true;
      } catch (error) {
        console.log(error);
      }
    },

    closeDialog() {
      this.dialog.model = false;
      this.getAllInventory();
      this.selectedSupplier = "";
    },

    openNewInventoryDialog() {
      try {
        this.dialog.isNew = true;
        this.dialog.isView = false;
        this.dialog.isEdit = false;
        this.dialog.title = "Add New Inventory";
        this.dialog.model = true;
        this.inventory = {
          item_id: "",
          item_name: "",
          description: "",
          quantity: "",
          reorder_level: "",
          unit_price: "",
          refsupplier_id: "",
          supplier_name: "",
        };
      } catch (error) {
        console.log(error);
      }
    },

    openViewInventoryDialog(inventory) {
      this.dialog.isNew = false;
      this.dialog.isView = true;
      this.dialog.isEdit = false;
      this.dialog.title = "View Inventory";
      this.dialog.model = true;
      this.inventory = inventory;
      this.selectedSupplier = inventory.supplier_name;
    },

    openEditInventoryDialog(inventory) {
      try {
        this.dialog.isNew = false;
        this.dialog.isView = false;
        this.dialog.isEdit = true;
        this.dialog.title = "Edit Inventory";
        this.dialog.model = true;
        this.inventory = inventory;
        this.selectedSupplier = inventory.supplier_name;
      } catch (error) {
        console.log(error);
      }
    },

    onSubmit() {
      try {
        if (this.$refs.form.validate()) {
          this.addNewInventory();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addNewInventory() {
      try {
        if (!confirm("Are you sure you want to add this inventory?")) return;
        console.log(
          "STOCK | addNewInventory | this.selectedSupplier",
          this.selectedSupplier
        );

        const req = {
          item_name: this.inventory.item_name,
          description: this.inventory.description,
          quantity: this.inventory.quantity,
          reorder_level: this.inventory.reorder_level,
          unit_price: this.inventory.unit_price,
          refsupplier_id: this.inventory.refsupplier_id,
        };
        apiHandler
          .post("inventory", req)
          .then((res) => {
            console.log(res);
            this.$refs.SnackBar.model = true;
            this.snackbar.text = "Inventory Added Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getAllInventory();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async updateItemInventory() {
      try {
        if (!confirm("Are you sure you want to update this inventory?")) return;

        const req = {
          item_name: this.inventory.item_name,
          description: this.inventory.description,
          quantity: this.inventory.quantity,
          reorder_level: this.inventory.reorder_level,
          unit_price: this.inventory.unit_price,
          refsupplier_id: this.inventory.refsupplier_id,
        };

        console.log("STOCK | updateItemInventory | req", req);

        apiHandler
          .put(`inventory/${this.inventory.item_id}`, req)
          .then((res) => {
            console.log(res);
            this.$refs.SnackBar.model = true;
            this.snackbar.text = "Inventory Updated Successfully";
            this.snackbar.color = "success";
            this.dialog.model = false;
            this.getAllInventory();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async deleteInventory(inventory) {
      try {
        if (!confirm("Are you sure you want to delete this inventory?")) return;
        apiHandler
          .delete(`inventory/${inventory.item_id}`)
          .then((res) => {
            console.log(res);
            this.$refs.SnackBar.model = true;
            this.snackbar.text = "Inventory Deleted Successfully";
            this.snackbar.color = "success";
            this.getAllInventory();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllInventory() {
      try {
        const inventoryStore = useInventoryStore();
        await inventoryStore.getAllInventory();
        // this.allInventory = inventoryStore.allInventory;

        const data = inventoryStore.allInventory;
        this.allInventory = [];

        data.forEach((inventory) => {
          if (this.filter.belowOrderLevelOnly) {
            if (inventory.quantity > inventory.reorder_level) {
              return;
            }
          }

          this.allInventory.push({
            item_id: inventory.item_id,
            item_name: inventory.item_name,
            description: inventory.description,
            quantity: inventory.quantity,
            reorder_level: inventory.reorder_level,
            unit_price: inventory.unit_price,
            refsupplier_id: inventory.refsupplier_id,
            supplier_name: inventory.supplier_name,
          });
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getAllSuppliers() {
      try {
        const supplierStore = useSupplierStore();
        await supplierStore.getAllSuppliers();
        this.allSuppliers = supplierStore.allSuppliers;
        // console.log(this.allSuppliers);
        this.allSuppliersItems = this.allSuppliers.map((supplier) => {
          return {
            name: supplier.supplier_name,
            id: supplier.supplier_id,
          };
        });

        console.log("STOCK | Supplier", this.allSuppliersItems);
      } catch (error) {
        console.log(error);
      }
    },

    async getItemSelection() {
      try {
        const arr = [];
        this.allSuppliersItems.forEach((supplier) => {
          arr.push(supplier.name);
        });
        this.itemSelection = arr;
      } catch (error) {
        console.log(error);
      }
    },

    async setItemSelection(id) {
      try {
        const supplier = this.allSuppliersItems.find((supplier) => {
          if (supplier.id === id) {
            return supplier;
          }
        });

        if (supplier) {
          return supplier.name;
        } else {
          return "Supplier not found";
        }
      } catch (error) {
        console.log(error);
      }
    },

    getMatchingSupplierNameFromID(supplierID) {
      try {
        const supplier = this.allSuppliersItems.find((supplier) => {
          if (
            supplier.id === supplierID ||
            supplier.id.toString() === supplierID
          ) {
            return supplier;
          }
        });

        console.log(
          "STOCK | getMatchingSupplierIdfromName | Supplier",
          supplier
        );

        if (supplier) {
          return supplier.name;
        } else {
          return "Supplier not found";
        }
      } catch (error) {
        console.log(error);
        return "Error finding supplier name";
      }
    },

    getMatchingSupplierIdfromName(supplierName) {
      try {
        const supplier = this.allSuppliersItems.find((supplier) => {
          if (supplier.name === supplierName) {
            return supplier;
          }
        });

        console.log(
          "STOCK | getMatchingSupplierIdfromName | Supplier",
          supplier
        );

        if (supplier) {
          return supplier.id;
        } else {
          return "Supplier not found";
        }
      } catch (error) {
        console.log(error);
        return "Error finding supplier name";
      }
    },
  },

  async created() {
    // Code to run when the component is mounted goes here
    await this.getAllInventory();
    await this.getAllSuppliers();
    this.getItemSelection();
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>

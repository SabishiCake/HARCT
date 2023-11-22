<template>
  <v-card>
    <v-card-title primary-title>
      <v-container grid-list-xs>
        <v-row>
          <v-col>
            <v-icon icon="mdi-format-list-bulleted"></v-icon>
            {{ title }}
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-bind="on"> New Item </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ dialogTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <!-- Your form elements here -->
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDialog"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="addNewItem"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              flat
              outlined
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-data-table
              :headers="tableHeader"
              :items="tableData"
              :search="search"
              class="elevation-1"
            >
              <template
                v-for="header in tableHeader"
                v-slot:[`item.${header.value}`]="{ item }"
              >
                {{ item[header.value] }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon size="small" class="me-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    tableHeader: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogTitle: "New Item",
      newItem: {}, // Your new item data here
    };
  },
  methods: {
    editItem(item) {
      this.$emit("edit-item", item);
    },
    deleteItem(item) {
      this.$emit("delete-item", item);
    },
    closeDialog() {
      this.dialog = false;
    },
    addNewItem() {
      this.$emit("add-new-item", this.newItem);
      // Reset newItem here
      this.newItem = {};
      this.closeDialog();
    },
  },
};
</script>

<style scoped></style>

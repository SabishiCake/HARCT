<template>
  <v-app>
    <div>
      <v-container grid-list-xs fluid>
        <v-row>
          <v-col> <h1>Customer Feedbacks</h1></v-col>
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
                    v-model="feedbackSearch"
                    label="Search"
                    prepend-inner-icon="mdi-magnify"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    color="success"
                    prepend-icon="mdi-plus"
                    @click="openNewFeedbackDialog"
                    block
                    >New</v-btn
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-toolbar color="primary">
                      <v-toolbar-title>Feedbacks</v-toolbar-title>
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
                        <v-col
                          v-if="!feedbackPagination.length"
                          cols="12"
                          class="text-center"
                        >
                          <v-card-text>No Feedbacks Found</v-card-text>
                        </v-col>
                        <v-col
                          v-for="(feedback, index) in feedbackPagination"
                          :key="index"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-card class="mx-auto" elevation="2" max-width="374">
                            <v-toolbar color="primary">
                              <v-toolbar-title>{{
                                feedback.name
                              }}</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-subtitle>
                              <span class="me-1">{{ feedback.email }}</span>

                              <v-icon
                                color="primary"
                                icon="mdi-email"
                                size="small"
                              ></v-icon>
                            </v-card-subtitle>
                            <v-divider></v-divider>
                            <v-card-text>
                              <div>
                                <span>Rating: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ feedback.rating }}</span
                                >
                              </div>
                              <br />
                              <div>
                                <span>Comment: </span>
                                <br />
                                <span
                                  class="text-h6 font-weight-light grey--text"
                                  >{{ feedback.comment }}</span
                                >
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
                                      @click="openEditFeedbackDialog(feedback)"
                                      prepend-icon="mdi-pencil"
                                      >edit</v-btn
                                    >
                                  </v-col>
                                  <v-col>
                                    <v-btn
                                      color="primary"
                                      text
                                      block
                                      @click="openViewFeedbackDialog(feedback)"
                                      prepend-icon="mdi-eye"
                                      >view</v-btn
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
                          <!-- pagination -->
                          <v-pagination
                            v-model="pagination.currentPage"
                            :length="
                              Math.ceil(
                                filteredFeedbacks.length / pagination.rowPerPage
                              )
                            "
                            @input="() => {}"
                            color="primary"
                            circle
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
      <v-dialog max-width="500px" v-model="dialog.model">
        <v-form ref="form" v-model="form" lazy-validation>
          <v-card>
            <v-toolbar color="primary">
              <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn icon @click="closeDialog">
                  <v-icon>mdi-close</v-icon>
                  <v-tooltip bottom activator="parent">
                    <span>Close</span>
                  </v-tooltip>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <v-container grid-list-xs dense>
                <v-row>
                  <v-col cols="12" v-if="dialog.edit || dialog.isView">
                    <v-text-field
                      v-model="dialog.item.feedback_id"
                      label="ID"
                      readonly
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="dialog.item.name"
                      label="Name"
                      :readonly="dialog.isView"
                      :rules="[rules.required]"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="dialog.item.email"
                      label="Email"
                      :readonly="dialog.isView"
                      :rules="[rules.email]"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-rating
                      v-model="dialog.item.rating"
                      background-color="grey lighten-2"
                      color="primary"
                      :readonly="dialog.isView"
                      :rules="[rules.rating]"
                      hover
                    >
                    </v-rating>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="dialog.item.comment"
                      label="Comment"
                      :readonly="dialog.isView"
                      :rules="[rules.required, rules.min]"
                      dense
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-container grid-list-xs>
                <v-row>
                  <v-col v-if="dialog.isNew">
                    <v-btn
                      color="success"
                      text
                      block
                      @click="onSubmit"
                      v-if="dialog.isNew"
                      :disabled="!form"
                      >Save</v-btn
                    >
                  </v-col>
                  <v-col v-if="dialog.isEdit">
                    <v-btn
                      color="success"
                      text
                      block
                      @click="updateFeedback"
                      :disabled="!form"
                      >Update</v-btn
                    >
                  </v-col>
                  <v-col v-if="dialog.isEdit">
                    <v-btn color="error" text block @click="deleteFeedback"
                      >Delete</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import { useFeedbackStore } from "@/store/app";
import apiHandler from "@/services/apiHandler";
export default {
  name: "Feedback",
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
        min: (v) => v.length >= 8 || "Min 8 characters",
        rating: (value) => {
          if (!value) {
            return "Rating is required";
          } else if (value < 1 || value > 5) {
            return "Rating must be between 1 and 5";
          } else {
            return true;
          }
        },

        email: (value) => {
          if (!value) {
            return "Email is required";
          } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)) {
            return "Invalid email format";
          } else {
            return true;
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

      feedbackSearch: "",
      allFeedbacks: [],
      allFeedbacksCopy: [],
    };
  },
  computed: {
    // Your component's computed properties go here
    filteredFeedbacks() {
      return this.allFeedbacksCopy.filter((feedback) => {
        return (
          feedback.name
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase()) ||
          feedback.email
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase()) ||
          feedback.comment
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase()) ||
          feedback.rating
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase()) ||
          feedback.created_at
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase()) ||
          feedback.updated_at
            .toLowerCase()
            .includes(this.feedbackSearch.toLowerCase())
        );
      });
    },
    feedbackPagination() {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.rowPerPage;
      const end = start + this.pagination.rowPerPage;
      return this.filteredFeedbacks.slice(start, end);
    },
  },
  methods: {
    // Your component's methods go here

    refresh() {
      this.getAllFeedbacks();
    },

    closeDialog() {
      this.dialog.isNew = false;
      this.dialog.isView = false;
      this.dialog.isEdit = false;
      this.dialog.title = "";
      this.dialog.model = false;
      this.dialog.item = {};
    },

    openNewFeedbackDialog() {
      console.log("new");
      this.dialog.isNew = true;
      this.dialog.isView = false;
      this.dialog.isEdit = false;
      this.dialog.title = "New Feedback";
      this.dialog.model = true;
      this.dialog.item = {};
    },

    openViewFeedbackDialog(item) {
      this.dialog.isView = true;
      this.dialog.isNew = false;
      this.dialog.isEdit = false;
      this.dialog.title = "View Feedback";
      this.dialog.model = true;

      this.dialog.item = item;
    },

    openEditFeedbackDialog(item) {
      this.dialog.isEdit = true;
      this.dialog.isNew = false;
      this.dialog.isView = false;
      this.dialog.title = "Edit Feedback";
      this.dialog.model = true;

      this.dialog.item = item;
    },

    async getAllFeedbacks() {
      try {
        const responseStore = useFeedbackStore();
        await responseStore.getAllFeedback();
        this.allFeedbacks = responseStore.allFeedback;
        this.allFeedbacksCopy = responseStore.allFeedback;

        console.log(this.allFeedbacks);
      } catch (error) {
        console.log(error);
      }
    },

    onSubmit() {
      try {
        if (this.$refs.form.validate()) {
          this.addNewFeedback();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async addNewFeedback() {
      try {
        if (!confirm("Are you sure you want to add this feedback?")) return;

        const data = {
          name: this.dialog.item.name,
          email: this.dialog.item.email,
          rating: this.dialog.item.rating,
          comment: this.dialog.item.comment,
        };
        apiHandler
          .post("feedback", data)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "New Feedback Added";
            this.snackbar.color = "success";
            this.closeDialog();
            this.getAllFeedbacks();
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = "Error Adding New Feedback";
            this.snackbar.color = "error";
          });
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "Error Adding New Feedback";
        this.snackbar.color = "error";
      }
    },

    async updateFeedback() {
      try {
        if (!confirm("Are you sure you want to update this feedback?")) return;
        const id = this.dialog.item.feedback_id;
        if (!id) return console.log("No id");
        const req = {
          name: this.dialog.item.name,
          email: this.dialog.item.email,
          rating: this.dialog.item.rating,
          comment: this.dialog.item.comment,
        };
        apiHandler
          .put(`feedback/${id}`, req)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Feedback Updated";
            this.snackbar.color = "success";
            this.closeDialog();
            this.getAllFeedbacks();
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = "Error Updating Feedback";
            this.snackbar.color = "error";
          });
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "Error Updating Feedback";
        this.snackbar.color = "error";
      }
    },

    async deleteFeedback() {
      try {
        if (!confirm("Are you sure you want to delete this feedback?")) return;
        const id = this.dialog.item.feedback_id;
        if (!id) return console.log("No id");
        apiHandler
          .delete(`feedback/${id}`)
          .then((response) => {
            console.log(response);
            this.snackbar.model = true;
            this.snackbar.text = "Feedback Deleted";
            this.snackbar.color = "success";
            this.closeDialog();
            this.getAllFeedbacks();
          })
          .catch((error) => {
            console.log(error);
            this.snackbar.model = true;
            this.snackbar.text = "Error Deleting Feedback";
            this.snackbar.color = "error";
          });
      } catch (error) {
        console.log(error);
        this.snackbar.model = true;
        this.snackbar.text = "Error Deleting Feedback";
        this.snackbar.color = "error";
      }
    },
  },

  async created() {
    await this.getAllFeedbacks();
  },
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>

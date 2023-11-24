/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import VueCookies from "vue-cookies";
import "vuetify/dist/vuetify.min.css";

export function registerPlugins(app) {
  // app.use(vuetify).use(router).use(pinia);
  app.use(vuetify);
  app.use(router);
  app.use(pinia);
  app.use(VueCookies);
}

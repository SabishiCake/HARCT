/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";

// Composables
import { createVuetify } from "vuetify";
import { VTextField } from "vuetify/lib/components/index.mjs";

const CustomTheme = {
  themes: {
    purple: {
      light: {
        // Purple color palette
        background: "#F5F3F7",
        surface: "#FFFFFF",
        primary: "#6A1B9A",
        "primary-darken-1": "#4A148C",
        secondary: "#7C4DFF",
        "secondary-darken-1": "#651FFF",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
      },
      dark: {
        // Purple dark color palette
        background: "#121212",
        surface: "#1E1E1E",
        primary: "#6A1B9A",
        "primary-darken-1": "#4A148C",
        secondary: "#7C4DFF",
        "secondary-darken-1": "#651FFF",
        error: "#CF6679",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFB74D",
      },
    },
    red: {
      light: {
        // Red color palette
        background: "#FBE9E7",
        surface: "#FFFFFF",
        primary: "#D32F2F",
        "primary-darken-1": "#B71C1C",
        secondary: "#FF5252",
        "secondary-darken-1": "#FF1744",
        error: "#B00020",
        info: "#1976D2",
        success: "#388E3C",
        warning: "#FF5722",
      },
      dark: {
        // Red dark color palette
        background: "#311B92",
        surface: "#1E1E1E",
        primary: "#D32F2F",
        "primary-darken-1": "#B71C1C",
        secondary: "#FF5252",
        "secondary-darken-1": "#FF1744",
        error: "#CF6679",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
    },
    green: {
      light: {
        // Green color palette
        background: "#E8F5E9",
        surface: "#FFFFFF",
        primary: "#2E7D32",
        "primary-darken-1": "#1B5E20",
        secondary: "#66BB6A",
        "secondary-darken-1": "#43A047",
        error: "#B00020",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
      dark: {
        // Green dark color palette
        background: "#1B5E20",
        surface: "#1E1E1E",
        primary: "#2E7D32",
        "primary-darken-1": "#1B5E20",
        secondary: "#66BB6A",
        "secondary-darken-1": "#43A047",
        error: "#CF6679",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
    },
    blue: {
      light: {
        // Blue color palette
        background: "#E3F2FD",
        surface: "#FFFFFF",
        primary: "#1565C0",
        "primary-darken-1": "#0D47A1",
        secondary: "#64B5F6",
        "secondary-darken-1": "#42A5F5",
        error: "#B00020",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
      dark: {
        // Blue dark color palette
        background: "#0D47A1",
        surface: "#1E1E1E",
        primary: "#1565C0",
        "primary-darken-1": "#0D47A1",
        secondary: "#64B5F6",
        "secondary-darken-1": "#42A5F5",
        error: "#CF6679",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
    },
    yellow: {
      light: {
        // Yellow color palette
        background: "#FFFDE7",
        surface: "#FFFFFF",
        primary: "#FBC02D",
        "primary-darken-1": "#FFA000",
        secondary: "#FFEB3B",
        "secondary-darken-1": "#FFD600",
        error: "#B00020",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
      dark: {
        // Yellow dark color palette
        background: "#FBC02D",
        surface: "#1E1E1E",
        primary: "#FBC02D",
        "primary-darken-1": "#FFA000",
        secondary: "#FFEB3B",
        "secondary-darken-1": "#FFD600",
        error: "#CF6679",
        info: "#1976D2",
        success: "#4CAF50",
        warning: "#FFA726",
      },
    },
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  defaults: {
    VTextField: {
      variant: "outlined",
      dense: true,
      color: "primary",
    },
    VSelect: {
      variant: "outlined",
      dense: true,
      color: "primary",
    },
  },

  theme: {
    defaultTheme: "purpleLight",
    themes: {
      purpleLight: {
        dark: false,
        colors: CustomTheme.themes.purple.light,
      },
      purpleDark: {
        dark: true,
        colors: CustomTheme.themes.purple.dark,
      },
      redLight: {
        dark: false,
        colors: CustomTheme.themes.red.light,
      },
      redDark: {
        dark: true,
        colors: CustomTheme.themes.red.dark,
      },
      greenLight: {
        dark: false,
        colors: CustomTheme.themes.green.light,
      },
      greenDark: {
        dark: true,
        colors: CustomTheme.themes.green.dark,
      },
      blueLight: {
        dark: false,
        colors: CustomTheme.themes.blue.light,
      },
      blueDark: {
        dark: true,
        colors: CustomTheme.themes.blue.dark,
      },
      yellowLight: {
        dark: false,
        colors: CustomTheme.themes.yellow.light,
      },
      yellowDark: {
        dark: true,
        colors: CustomTheme.themes.yellow.dark,
      },
    },
  },

  preferences: {
    apiSettings: {
      apiUrl: "http://localhost:8000/private",
      apiKey: "key2fghij",
    },
  },

  components: {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
  },
});

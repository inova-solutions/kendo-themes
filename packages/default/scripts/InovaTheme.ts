import Sass from "./SassHelpers";

/**
 * Diese Klasse definiert alle InovaStyles
 * Diese werden als CSS Variablen auf den Body per JavaScript gesetzt
 */
const InovaTheme = (function () {
  /**
   * Der Body ist das Element, auf welches die CSS Variablen gesetzt werden
   */
  const themeWrapper = document.getElementsByTagName("body")[0];

  /**
   * Farb Konstanten
   */
  const colors = {
    inova_pink: "#e81e75",
    inova_pink_rgb: "232, 30, 117",
    inova_pink_lighter: "#f290b6",
    inova_blue: "#1e98e8",
    inova_gray: "#323232",
    inova_gray_medium: "#c4c4c4",
    inova_gray_light: "#e8e8e8",
    inova_red: "#dc3535",
    inova_orange: "#fd7e14",
    inova_yellow: "#ffc107",
    inova_green: "#1fb141",
    inova_indigo: "#6610f2",
    inova_purple: "#b046be",
    inova_cyan: "#00bad8",
    inova_palette_faded_red: "#E9A6A5",
    inova_palette_faded_orange: "#EFCDA8",
    inova_palette_faded_yellow: "#F5F4AC",
    inova_palette_faded_lime: "#D4F3AB",
    inova_palette_faded_green: "#B5F2AB",
    inova_palette_faded_turquoise: "#B5F2CE",
    inova_palette_faded_pink: "#E9A7CA",
    inova_palette_faded_violet: "#EFBCF5",
    inova_palette_faded_purple: "#D3BAF5",
    inova_palette_faded_indigo: "#B8B9F4",
    inova_palette_faded_blue: "#BED8F6",
    inova_palette_faded_mint: "#C5F7F8",
    inova_palette_faded_white: "#FFFFFF",
    inova_palette_faded_gray1: "#E6E6E6",
    inova_palette_faded_gray2: "#CCCCCC",
    inova_palette_faded_gray3: "#B3B3B3",
    inova_palette_faded_font: "#222222",
    light_text_color: "#222222",
    light_text_color_rgb: "34, 34, 34",
    light_text_color_inverse: "#ffffff",
    light_text_color_inverse_rgb: "255, 255, 255",
    light_bg_color: "#ffffff",
    light_base_text: "#222222",
    light_base_text_soft: "#6e6e6e",
    light_base_bg: "#f2f2f2",
    light_base_bg_darker: "#e6e6e6",
    light_base_bg_lighter: "#f5f5f5",
    light_base_border: "rgba(0,0,0,0.12)",
    light_shadow_color: "#9e9e9e",
    gray_text_color: "#656565",
    gray_text_color_inverse: "#ffffff",
    gray_bg_color: "#ffffff",
    gray_base_text: "#656565",
    gray_base_text_soft: "#6e6e6e",
    gray_base_bg: "#f6f6f6",
    gray_base_bg_darker: "#e9e9e9",
    gray_base_bg_lighter: "#f5f5f5",
    gray_base_border: "rgba(0,0,0,0.08)",
    gray_shadow_color: "#9e9e9e",
    dark_text_color: "#f6f6f6",
    dark_text_color_rgb: "246, 246, 246",
    dark_text_color_inverse: "#f6f6f6",
    dark_text_color_inverse_rgb: "246, 246, 246",
    dark_bg_color: "#333",
    dark_base_text: "#f6f6f6",
    dark_base_text_soft: "#adadad",
    dark_base_bg: "#444",
    dark_base_bg_darker: "#3b3b3b",
    dark_base_bg_lighter: "#3b3b3b",
    dark_base_border: "rgba(0,0,0,0.08)",
    dark_shadow_color: "#0a0a0a",
    inova_series_a: "#e81e75",
    inova_series_b: "#ffd246",
    inova_series_c: "#78d237",
    inova_series_d: "#28b4c8",
    inova_series_e: "#2d73f5",
    inova_series_f: "#aa46be",
    inova_series_b_light: "rgba(255,210,70,0.45)",
    inova_series_a_light: "rgba(231,31,108,0.35)",
    inova_series_e_light: "rgba(45,115,245,0.3)",
  };

  /**
   * Entfernt die Theme Klasse vom Body
   */
  const removeCurrentThemeClass = () => {
    for (let i = 0; i < document.body.classList.length; i++) {
      const c = document.body.classList[i];
      if (c.match("^theme-")) {
        document.body.classList.remove(c);
      }
    }
  };

  /**
   * Setzt eine CSS Variable im Dom
   * @param varName Name der CSS Variable
   * @param variable Wert
   * @returns {void}
   */
  const setCssVar = (varName: string, variable: string) =>
    themeWrapper.style.setProperty(varName, variable);

  /**
   * Lädt gemeinsame Basis von allen Themes
   * @param accent Akzentfarbe
   */
  const loadBaseTheme = function (accent: any) {
    setCssVar("--k-accent", accent);
    setCssVar("--k-accent-contrast", Sass.contrastWcag(accent));
    setCssVar("--k-info", colors.inova_blue);
    setCssVar("--k-success", colors.inova_green);
    setCssVar("--k-warning", colors.inova_yellow);
    setCssVar("--k-error", colors.inova_red);
    setCssVar("--k-selected-bg", accent);
    setCssVar("--k-selected-text", colors.light_text_color_inverse);
    setCssVar("--color-accent", accent);
    setCssVar("--inova-pink", colors.inova_pink);
    setCssVar("--inova-blue", colors.inova_blue);
    setCssVar("--inova-gray", colors.inova_gray);
    setCssVar("--inova-gray-medium", colors.inova_gray_medium);
    setCssVar("--inova-gray-light", colors.inova_gray_light);
    setCssVar("--k-series-a", colors.inova_series_a);
    setCssVar("--k-series-b", colors.inova_series_b);
    setCssVar("--k-series-c", colors.inova_series_c);
    setCssVar("--k-series-d", colors.inova_series_d);
    setCssVar("--k-series-e", colors.inova_series_e);
    setCssVar("--k-series-f", colors.inova_series_f);
    setCssVar("--k-series-a-light", colors.inova_series_a_light);
    setCssVar("--k-series-b-light", colors.inova_series_b_light);
    setCssVar("--k-series-e-light", colors.inova_series_e_light);
    setCssVar("--k-chart-major-lines", "rgba(0, 0, 0, 0.08)");
    setCssVar("--k-chart-minor-lines", "rgba(0, 0, 0, 0.04)");
    setCssVar("--color-error", colors.inova_red);
    setCssVar("--color-warning", colors.inova_yellow);
    setCssVar("--color-success", colors.inova_green);
    setCssVar("--color-info", colors.inova_cyan);
    setCssVar("--color-accent-rgb", colors.inova_pink_rgb);
    setCssVar("--color-font-rgb", colors.light_text_color_rgb);
    setCssVar("--color-font-inverse-rgb", colors.light_text_color_inverse_rgb);
    setCssVar("--i-palette-faded-red", colors.inova_palette_faded_red);
    setCssVar("--i-palette-faded-orange", colors.inova_palette_faded_orange);
    setCssVar("--i-palette-faded-yellow", colors.inova_palette_faded_yellow);
    setCssVar("--i-palette-faded-lime", colors.inova_palette_faded_lime);
    setCssVar("--i-palette-faded-green", colors.inova_palette_faded_green);
    setCssVar("--i-palette-faded-turquoise", colors.inova_palette_faded_turquoise);
    setCssVar("--i-palette-faded-pink", colors.inova_palette_faded_pink);
    setCssVar("--i-palette-faded-violet", colors.inova_palette_faded_violet);
    setCssVar("--i-palette-faded-purple", colors.inova_palette_faded_purple);
    setCssVar("--i-palette-faded-indigo", colors.inova_palette_faded_indigo);
    setCssVar("--i-palette-faded-blue", colors.inova_palette_faded_blue);
    setCssVar("--i-palette-faded-mint", colors.inova_palette_faded_mint);
    setCssVar("--i-palette-faded-white", colors.inova_palette_faded_white);
    setCssVar("--i-palette-faded-gray1", colors.inova_palette_faded_gray1);
    setCssVar("--i-palette-faded-gray2", colors.inova_palette_faded_gray2);
    setCssVar("--i-palette-faded-gray3", colors.inova_palette_faded_gray3);
    setCssVar("--i-palette-faded-font", colors.inova_palette_faded_font);
  };

  /**
   * Basiert auf Base Theme
   */
  const loadDarkTheme = function () {
    const hoveredBg = "#555555";
    const accent = colors.inova_pink;

    loadBaseTheme(accent);
    setCssVar("--k-text-color", colors.dark_base_text);
    setCssVar("--k-bg-color", colors.dark_bg_color);
    setCssVar("--k-base-text", colors.dark_base_text);
    setCssVar("--k-base-bg", colors.dark_base_bg);
    setCssVar( "--k-base-bg-darker", colors.dark_base_bg_darker);
    setCssVar("--k-base-bg-lighter", colors.dark_base_bg_lighter);
    setCssVar("--k-base-border", colors.dark_base_border);
    setCssVar("--k-base-gradient", colors.dark_base_bg + "," + Sass.pSBC(-0.02, colors.dark_base_bg));
    setCssVar("--k-hovered-text", "#ffffff");
    setCssVar("--k-hovered-bg", hoveredBg);
    setCssVar("--k-hovered-border", "rgba(0,0,0,0.15)");
    setCssVar("--k-hovered-gradient", hoveredBg + "," + Sass.pSBC(-0.02, hoveredBg));
    setCssVar("--k-selected-border", "rgba(0,0,0,0.1)");
    setCssVar("--color-border", colors.dark_base_border);
    setCssVar("--color1", colors.dark_base_bg);
    setCssVar("--color2", colors.dark_base_bg);
    setCssVar("--color3", colors.dark_base_bg);
    setCssVar("--color-font", colors.dark_base_text);
    setCssVar("--color-font-soft", colors.dark_base_text_soft);
    setCssVar("--color-icon1", colors.dark_base_text);
    setCssVar("--color-icon2", colors.dark_base_text);
    setCssVar("--color-widget-inset", colors.dark_bg_color);
    setCssVar("--color-shadow", colors.dark_shadow_color);
    setCssVar("--color-font-rgb", colors.dark_text_color_rgb);
    setCssVar("--color-font-inverse-rgb", colors.dark_text_color_inverse_rgb);

    removeCurrentThemeClass();
    document.body.classList.add("theme-dark");
    document.body.classList.add("theme-darkpink");
  };

  /**
   * Basiert auf Base Theme
   */
  const loadLightTheme = function () {
    const hoveredBg = "#ededed";
    const accent = colors.inova_pink;

    loadBaseTheme(accent);
    setCssVar("--k-text-color", colors.light_text_color);
    setCssVar("--k-bg-color", colors.light_bg_color);
    setCssVar("--k-base-text", colors.light_base_text);
    setCssVar("--k-base-bg", colors.light_base_bg);
    setCssVar("--k-base-bg-darker", colors.light_base_bg_darker);
    setCssVar("--k-base-bg-lighter", colors.light_base_bg_lighter);
    setCssVar("--k-base-border", colors.light_base_border);
    setCssVar("--k-base-gradient", colors.light_base_bg + "," + Sass.pSBC(-0.02, colors.light_base_bg));
    setCssVar("--k-hovered-text", "#222222");
    setCssVar("--k-hovered-bg", hoveredBg);
    setCssVar("--k-hovered-border", "rgba(0,0,0,0.19)");
    setCssVar("--k-hovered-gradient", hoveredBg + "," + Sass.pSBC(-0.02, hoveredBg));
    setCssVar("--k-selected-border", "rgba(0,0,0,0.14)");
    setCssVar("--color-border", "#cccccc");
    setCssVar("--color1", colors.light_bg_color);
    setCssVar("--color2", colors.inova_gray_light);
    setCssVar("--color3", colors.inova_gray_medium);
    setCssVar("--color-font", colors.light_text_color);
    setCssVar("--color-font-soft", colors.light_base_text_soft);
    setCssVar("--color-icon1", colors.light_text_color);
    setCssVar("--color-icon2", colors.light_text_color_inverse);
    setCssVar("--color-widget-inset", "#ffffff");
    setCssVar("--color-error-light", "#ffe0d9");
    setCssVar("--color-warning-light", "#fbeed5");
    setCssVar("--color-success-light", "#eaf7ec");
    setCssVar("--color-info-light", "#e5f5fa");
    setCssVar("--color-shadow", colors.light_shadow_color);

    removeCurrentThemeClass();
    document.body.classList.add("theme-light");
    document.body.classList.add("theme-olivepink");
  };

  /**
   * Veröffentlicht werden die Funktionen um die Jeweiligen Themes zu laden
   */
  return {
    load: function (themeName: string) {
      switch (themeName) {
        case "dark":
          loadDarkTheme();
          break;
        case "light":
          loadLightTheme();
          break;
      }
    },
    loadDarkTheme: loadDarkTheme,
    loadLightTheme: loadLightTheme,
  };
})();
(<any>window).InovaTheme = InovaTheme;

/**
 * Falls innerhalb des alten FIS WEB Desktops (d.h. wenn inovaGlobal.theme gesetzt ist)
 * wird die entsprechende Theme Funktion aufgerufen.
 * Ansonsten wird das Light theme aufgerufen.
 */
if ((<any>window).inovaGlobal && (<any>window).inovaGlobal.theme) {
  switch ((<any>window).inovaGlobal.theme) {
    case "Dark":
    /** Damit die Themes im alten Desktop funktionieren */
    case "DarkPink":
      InovaTheme.loadDarkTheme();
      break;
    case "Light":
    /** Damit die Themes im alten Desktop funktionieren */
    case "OlivePink":
      InovaTheme.loadLightTheme();
      break;
  }
} else {
  InovaTheme.loadLightTheme();
}

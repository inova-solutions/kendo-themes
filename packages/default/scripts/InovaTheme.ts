/**
 * Diese Klasse definiert alle InovaStyles
 * Diese werden als CSS Variablen auf den Body per JavaScript gesetzt
 */
const InovaTheme = (function () {
  /**
   * Der Body ist das Element, auf welches die CSS Variablen gesetzt werden
   */
  const themeWrapper = document.getElementsByTagName("body")[0];

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
  };

  /**
   * Die folgenden Funktionen sind kopiert aus dem sass-Source-Code um dieselben Farbfunktionen abzubilden
   * wie in den Kendo Themes verwendet werden
   */

  let pSBCr = undefined;

  // lighten / darken a Color
  // from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
  const pSBC = function (p: number, from: any, to?: any) {
    // errorCheck
    if (
      typeof p !== "number" ||
      p < -1 ||
      p > 1 ||
      typeof from !== "string" ||
      (from[0] !== "r" && from[0] !== "#") ||
      (to && typeof to !== "string")
    ) {
      return null;
    }

    let i = parseInt,
      r = Math.round;

    if (!pSBCr) {
      pSBCr = (d) => {
        const l = d.length,
          RGB = {};
        if (l > 9) {
          d = d.split(",");
          // errorCheck
          if (d.length < 3 || d.length > 4) {
            return null;
          }
          RGB[0] = i(d[0].split("(")[1]);
          RGB[1] = i(d[1]);
          RGB[2] = i(d[2]);
          RGB[3] = d[3] ? parseFloat(d[3]) : -1;
        } else {
          if (l === 8 || l === 6 || l < 4) {
            return null; // errorCheck
          }
          if (l < 6) {
            d =
              "#" +
              d[1] +
              d[1] +
              d[2] +
              d[2] +
              d[3] +
              d[3] +
              (l > 4 ? d[4] + "" + d[4] : ""); // 3 or 4 digit
          }
          /* tslint:disable */
          (d = i(d.slice(1), 16)),
            (RGB[0] = (d >> 16) & 255),
            (RGB[1] = (d >> 8) & 255),
            (RGB[2] = d & 255),
            (RGB[3] = -1);
          if (l === 9 || l === 5) {
            (RGB[3] = r((RGB[2] / 255) * 10000) / 10000),
              (RGB[2] = RGB[1]),
              (RGB[1] = RGB[0]),
              (RGB[0] = (d >> 24) & 255);
          }
          /* tslint:enable */
        }
        return RGB;
      };
    }

    let h = from.length > 9;
    let b = p < 0;
    to = to && to !== "c" ? to : b ? "#000000" : "#FFFFFF";
    let f = pSBCr(from);
    let t = pSBCr(to);

    p = b ? p * -1 : p;
    h =
      typeof to === "string"
        ? to.length > 9
          ? true
          : to === "c"
          ? !h
          : false
        : h;

    if (!f || !t) {
      return null; // errorCheck
    }
    if (h) {
      return (
        "rgb" +
        (f[3] > -1 || t[3] > -1 ? "a(" : "(") +
        r((t[0] - f[0]) * p + f[0]) +
        "," +
        r((t[1] - f[1]) * p + f[1]) +
        "," +
        r((t[2] - f[2]) * p + f[2]) +
        (f[3] < 0 && t[3] < 0
          ? ")"
          : "," +
            (f[3] > -1 && t[3] > -1
              ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
              : t[3] < 0
              ? f[3]
              : t[3]) +
            ")")
      );
    } else {
      return (
        "#" +
        (
          0x100000000 +
          r((t[0] - f[0]) * p + f[0]) * 0x1000000 +
          r((t[1] - f[1]) * p + f[1]) * 0x10000 +
          r((t[2] - f[2]) * p + f[2]) * 0x100 +
          (f[3] > -1 && t[3] > -1
            ? r(((t[3] - f[3]) * p + f[3]) * 255)
            : t[3] > -1
            ? r(t[3] * 255)
            : f[3] > -1
            ? r(f[3] * 255)
            : 255)
        )
          .toString(16)
          .slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2)
      );
    }
  };

  const chGcd = function (a: any, b: any) {
    // from: http://rosettacode.org/wiki/Greatest_common_divisor#JavaScript
    if (b !== 0) {
      return chGcd(b, a % b);
    } else {
      return Math.abs(a);
    }
  };

  const chNthRoot = function (num: any, n: any, prec: any) {
    if (n === undefined) {
      n = 2;
    }
    if (prec === undefined) {
      prec = 12;
    }

    // from: http://rosettacode.org/wiki/Nth_root#JavaScript
    let x = 1;

    for (let i = 0; i <= prec; i++) {
      /* tslint:disable */
      x = (1 / n) * ((n - 1) * x + num / chPow(x, n - 1));
      /* tslint:enable */
    }

    return x;
  };

  const chPow = function (base: any, exponent: any, prec?: any) {
    // handles decimal exponents by trying to convert them into a fraction and then use a nthRoot-algorithm for parts of the calculation
    if (prec === undefined) {
      prec = 12;
    }
    let prec2, denominator;

    if (Math.floor(exponent) !== exponent) {
      prec2 = chPow(10, prec, undefined);
      exponent = Math.round(exponent * prec2);
      denominator = chGcd(exponent, prec2);
      return chNthRoot(
        chPow(base, exponent / denominator, undefined),
        prec2 / denominator,
        prec
      );
    }

    let value = base;

    if (exponent > 1) {
      for (let i = 2; i <= exponent; i++) {
        value = value * base;
      }
    } else {
      for (let i = 0; i >= exponent; i--) {
        value = value / base;
      }
    }

    return value;
  };

  const hexToRgb = function (hex: any) {
    // from https://stackoverflow.com/a/5624139
    // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (
      m: any,
      r: any,
      g: any,
      b: any
    ) {
      m = m;
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const chColorLuminance = function (color: any) {
    // adapted from: https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
    // formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    let rgba = [];
    if (color[0] === "#") {
      const comp = hexToRgb(color);
      rgba = [comp.r, comp.g, comp.b];
    } else {
      rgba = color.match(/\d+/g);
    }
    const rgba2 = [];

    for (let i = 0; i < 3; i++) {
      let rgb = rgba[i];
      rgb = rgb / 255;
      rgb = rgb < 0.03928 ? rgb / 12.92 : chPow((rgb + 0.055) / 1.055, 2.4, 16);
      rgba2.push(rgb);
    }

    return 0.2126 * rgba2[0] + 0.7152 * rgba2[1] + 0.0722 * rgba2[2];
  };

  const contrastWcag = function (color: any) {
    const dark = "#000000",
      light = "#ffffff";
    const luma = chColorLuminance(color);
    const out = luma < 0.5 ? light : dark;
    return out;
  };

  const loadBaseTheme = function (accent: any) {
    themeWrapper.style.setProperty("--k-accent", accent);
    themeWrapper.style.setProperty("--k-accent-contrast", contrastWcag(accent));
    themeWrapper.style.setProperty("--k-info", colors.inova_blue);
    themeWrapper.style.setProperty("--k-success", colors.inova_green);
    themeWrapper.style.setProperty("--k-warning", colors.inova_yellow);
    themeWrapper.style.setProperty("--k-error", colors.inova_red);
    themeWrapper.style.setProperty("--k-selected-bg", accent);
    themeWrapper.style.setProperty(
      "--k-selected-text",
      colors.light_text_color_inverse
    );
    themeWrapper.style.setProperty("--color-accent", accent);
    themeWrapper.style.setProperty("--inova-pink", colors.inova_pink);
    themeWrapper.style.setProperty("--inova-blue", colors.inova_blue);
    themeWrapper.style.setProperty("--inova-gray", colors.inova_gray);
    themeWrapper.style.setProperty(
      "--inova-gray-medium",
      colors.inova_gray_medium
    );
    themeWrapper.style.setProperty(
      "--inova-gray-light",
      colors.inova_gray_light
    );

    themeWrapper.style.setProperty("--k-series-a", colors.inova_series_a);
    themeWrapper.style.setProperty("--k-series-b", colors.inova_series_b);
    themeWrapper.style.setProperty("--k-series-c", colors.inova_series_c);
    themeWrapper.style.setProperty("--k-series-d", colors.inova_series_d);
    themeWrapper.style.setProperty("--k-series-e", colors.inova_series_e);
    themeWrapper.style.setProperty("--k-series-f", colors.inova_series_f);
    themeWrapper.style.setProperty(
      "--k-chart-major-lines",
      "rgba(0, 0, 0, 0.08)"
    );
    themeWrapper.style.setProperty(
      "--k-chart-minor-lines",
      "rgba(0, 0, 0, 0.04)"
    );

    themeWrapper.style.setProperty("--color-error", colors.inova_red);
    themeWrapper.style.setProperty("--color-warning", colors.inova_yellow);
    themeWrapper.style.setProperty("--color-success", colors.inova_green);
    themeWrapper.style.setProperty("--color-info", colors.inova_cyan);

    themeWrapper.style.setProperty("--color-accent-rgb", colors.inova_pink_rgb);
    themeWrapper.style.setProperty("--color-font-rgb", colors.light_text_color_rgb);

    themeWrapper.style.setProperty("--i-palette-faded-red", colors.inova_palette_faded_red);
    themeWrapper.style.setProperty("--i-palette-faded-orange", colors.inova_palette_faded_orange);
    themeWrapper.style.setProperty("--i-palette-faded-yellow", colors.inova_palette_faded_yellow);
    themeWrapper.style.setProperty("--i-palette-faded-lime", colors.inova_palette_faded_lime);
    themeWrapper.style.setProperty("--i-palette-faded-green", colors.inova_palette_faded_green);
    themeWrapper.style.setProperty("--i-palette-faded-turquoise", colors.inova_palette_faded_turquoise);
    themeWrapper.style.setProperty("--i-palette-faded-pink", colors.inova_palette_faded_pink);
    themeWrapper.style.setProperty("--i-palette-faded-violet", colors.inova_palette_faded_violet);
    themeWrapper.style.setProperty("--i-palette-faded-purple", colors.inova_palette_faded_purple);
    themeWrapper.style.setProperty("--i-palette-faded-indigo", colors.inova_palette_faded_indigo);
    themeWrapper.style.setProperty("--i-palette-faded-blue", colors.inova_palette_faded_blue);
    themeWrapper.style.setProperty("--i-palette-faded-mint", colors.inova_palette_faded_mint);
    themeWrapper.style.setProperty("--i-palette-faded-white", colors.inova_palette_faded_white);
    themeWrapper.style.setProperty("--i-palette-faded-gray1", colors.inova_palette_faded_gray1);
    themeWrapper.style.setProperty("--i-palette-faded-gray2", colors.inova_palette_faded_gray2);
    themeWrapper.style.setProperty("--i-palette-faded-gray3", colors.inova_palette_faded_gray3);
    themeWrapper.style.setProperty("--i-palette-faded-font", colors.inova_palette_faded_font);
  };

  /**
   * Basiert auf Base Theme
   */
  const loadDarkTheme = function () {
    const hoveredBg = "#555555",
      accent = colors.inova_pink;
    loadBaseTheme(accent);
    themeWrapper.style.setProperty("--k-text-color", colors.dark_base_text);
    themeWrapper.style.setProperty("--k-bg-color", colors.dark_bg_color);
    themeWrapper.style.setProperty("--k-base-text", colors.dark_base_text);
    themeWrapper.style.setProperty("--k-base-bg", colors.dark_base_bg);
    themeWrapper.style.setProperty(
      "--k-base-bg-darker",
      colors.dark_base_bg_darker
    );
    themeWrapper.style.setProperty(
      "--k-base-bg-lighter",
      colors.dark_base_bg_lighter
    );
    themeWrapper.style.setProperty("--k-base-border", colors.dark_base_border);
    themeWrapper.style.setProperty(
      "--k-base-gradient",
      colors.dark_base_bg + "," + pSBC(-0.02, colors.dark_base_bg)
    );
    themeWrapper.style.setProperty("--k-hovered-text", "#ffffff");
    themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
    themeWrapper.style.setProperty("--k-hovered-border", "rgba(0,0,0,0.15)");
    themeWrapper.style.setProperty(
      "--k-hovered-gradient",
      hoveredBg,
      pSBC(-0.02, hoveredBg)
    );
    themeWrapper.style.setProperty("--k-selected-border", "rgba(0,0,0,0.1)");
    themeWrapper.style.setProperty("--color-border", colors.dark_base_border);
    themeWrapper.style.setProperty("--color1", colors.dark_base_bg);
    themeWrapper.style.setProperty("--color2", colors.dark_base_bg);
    themeWrapper.style.setProperty("--color3", colors.dark_base_bg);
    themeWrapper.style.setProperty("--color-font", colors.dark_base_text);
    themeWrapper.style.setProperty(
      "--color-font-soft",
      colors.dark_base_text_soft
    );
    themeWrapper.style.setProperty("--color-icon1", colors.dark_base_text);
    themeWrapper.style.setProperty("--color-icon2", colors.dark_base_text);
    themeWrapper.style.setProperty(
      "--color-widget-inset",
      colors.dark_bg_color
    );
    themeWrapper.style.setProperty("--color-shadow", colors.dark_shadow_color);

    themeWrapper.style.setProperty("--color-font-rgb", colors.dark_text_color_rgb);

    removeCurrentThemeClass();
    document.body.classList.add("theme-dark");
    document.body.classList.add("theme-darkpink");
  };

  /**
   * Basiert auf Base Theme
   */
  const loadLightTheme = function () {
    const hoveredBg = "#efebe6",
      accent = colors.inova_pink;
    loadBaseTheme(accent);
    themeWrapper.style.setProperty("--k-text-color", colors.light_text_color);
    themeWrapper.style.setProperty("--k-bg-color", colors.light_bg_color);
    themeWrapper.style.setProperty("--k-base-text", colors.light_base_text);
    themeWrapper.style.setProperty("--k-base-bg", colors.light_base_bg);
    themeWrapper.style.setProperty(
      "--k-base-bg-darker",
      colors.light_base_bg_darker
    );
    themeWrapper.style.setProperty(
      "--k-base-bg-lighter",
      colors.light_base_bg_lighter
    );
    themeWrapper.style.setProperty("--k-base-border", colors.light_base_border);
    themeWrapper.style.setProperty(
      "--k-base-gradient",
      colors.light_base_bg + "," + pSBC(-0.02, colors.light_base_bg)
    );
    themeWrapper.style.setProperty("--k-hovered-text", "#222222");
    themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
    themeWrapper.style.setProperty("--k-hovered-border", "rgba(0,0,0,0.19)");
    themeWrapper.style.setProperty(
      "--k-hovered-gradient",
      hoveredBg,
      pSBC(-0.02, hoveredBg)
    );
    themeWrapper.style.setProperty("--k-selected-border", "rgba(0,0,0,0.14)");
    themeWrapper.style.setProperty("--color-border", "#cccccc");
    themeWrapper.style.setProperty("--color1", colors.light_bg_color);
    themeWrapper.style.setProperty("--color2", colors.inova_gray_light);
    themeWrapper.style.setProperty("--color3", colors.inova_gray_medium);
    themeWrapper.style.setProperty("--color-font", colors.light_text_color);
    themeWrapper.style.setProperty(
      "--color-font-soft",
      colors.light_base_text_soft
    );
    themeWrapper.style.setProperty("--color-icon1", colors.light_text_color);
    themeWrapper.style.setProperty(
      "--color-icon2",
      colors.light_text_color_inverse
    );
    themeWrapper.style.setProperty("--color-widget-inset", "#ffffff");
    themeWrapper.style.setProperty("--color-error-light", "#ffe0d9");
    themeWrapper.style.setProperty("--color-warning-light", "#fbeed5");
    themeWrapper.style.setProperty("--color-success-light", "#eaf7ec");
    themeWrapper.style.setProperty("--color-info-light", "#e5f5fa");
    themeWrapper.style.setProperty("--color-shadow", colors.light_shadow_color);

    removeCurrentThemeClass();
    document.body.classList.add("theme-light");
    document.body.classList.add("theme-olivepink");
  };

  const removeCurrentThemeClass = () => {
    for (let i = 0; i < document.body.classList.length; i++) {
      const c = document.body.classList[i];
      if (c.match("^theme-")) {
        document.body.classList.remove(c);
      }
    }
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
 * Falls innerhalb des alten inova-Desktops (d.h. wenn inovaGlobal.theme gesetzt ist)
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

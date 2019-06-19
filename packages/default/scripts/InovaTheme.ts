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
        inova_blue: "#1e98e8",
        inova_oliv: "#564925",
        inova_oliv_medium: "#ccc9be",
        inova_oliv_light: "#ece8e2",
        inova_red: "#dc3535",
        inova_orange: "#fd7e14",
        inova_yellow: "#ffc107",
        inova_green: "#1fb141",
        inova_indigo: "#6610f2",
        inova_purple: "#b046be",
        inova_cyan: "#00bad8",
        light_text_color: "#333333",
        light_text_color_inverse: "#ffffff",
        light_bg_color: "#ffffff",
        light_base_text: "#333333",
        light_base_bg: "#f4f2ee",
        light_base_border: "rgba(black, 0.12)",
        gray_text_color: "#656565",
        gray_text_color_inverse: "#ffffff",
        gray_bg_color: "#ffffff",
        gray_base_text: "#656565",
        gray_base_bg: "#f6f6f6",
        gray_base_border: "rgba(black, 0.08)",
        dark_text_color: "#f6f6f6",
        dark_text_color_inverse: "#f6f6f6",
        dark_bg_color: "#333",
        dark_base_text: "#f6f6f6",
        dark_base_bg: "#444",
        dark_base_border: "rgba(black, 0.08)"
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
        if (typeof (p) !== "number" || p < -1 || p > 1 || typeof (from) !== "string"
            || (from[0] !== "r" && from[0] !== "#") || (to && typeof (to) !== "string")) {
            return null;
        }

        let i = parseInt,
            r = Math.round;

        if (!pSBCr) {
            pSBCr = (d) => {
                const l = d.length, RGB = {};
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
                        d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); // 3 or 4 digit
                    }
                    /* tslint:disable */
                    d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = -1;
                    if (l === 9 || l === 5) {
                        RGB[3] = r((RGB[2] / 255) * 10000) / 10000, RGB[2] = RGB[1], RGB[1] = RGB[0], RGB[0] = d >> 24 & 255
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
        h = typeof (to) === "string" ? to.length > 9 ? true : to === "c" ? !h : false : h;

        if (!f || !t) {
            return null; // errorCheck
        }
        if (h) {
            return "rgb" + (f[3] > -1 || t[3] > -1 ? "a(" : "(")
                + r((t[0] - f[0]) * p + f[0]) + ","
                + r((t[1] - f[1]) * p + f[1]) + ","
                + r((t[2] - f[2]) * p + f[2])
                + (f[3] < 0 && t[3] < 0 ? ")" : ","
                    + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3])
                    + ")");
        } else {
            return "#" + (0x100000000 + r((t[0] - f[0]) * p + f[0]) * 0x1000000
                + r((t[1] - f[1]) * p + f[1]) * 0x10000
                + r((t[2] - f[2]) * p + f[2]) * 0x100
                + (f[3] > -1 && t[3] > -1
                    ? r(((t[3] - f[3]) * p + f[3]) * 255)
                    : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255))
                .toString(16).slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2);
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
        if (n === undefined) { n = 2; }
        if (prec === undefined) { prec = 12; }

        // from: http://rosettacode.org/wiki/Nth_root#JavaScript
        let x = 1;

        for (let i = 0; i <= prec; i++) {
            /* tslint:disable */
            x = 1 / n * ((n - 1) * x + (num / chPow(x, n - 1)));
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
            return chNthRoot(chPow(base, exponent / denominator, undefined), prec2 / denominator, prec);
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
        hex = hex.replace(shorthandRegex, function (m: any, r: any, g: any, b: any) {
            m = m;
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
            rgb = rgb < .03928 ? rgb / 12.92 : chPow((rgb + .055) / 1.055, 2.4, 16);
            rgba2.push(rgb);
        }

        return .2126 * rgba2[0] + .7152 * rgba2[1] + 0.0722 * rgba2[2];
    };

    const contrastWcag = function (color: any) {
        const dark = "#000000", light = "#ffffff";
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
        themeWrapper.style.setProperty("--k-selected-text", colors.light_text_color);
        themeWrapper.style.setProperty("--k-selected-bg", accent);
        themeWrapper.style.setProperty("--color-accent", accent);
        themeWrapper.style.setProperty("--inova-pink", colors.inova_pink);
        themeWrapper.style.setProperty("--inova-blue", colors.inova_blue);
        themeWrapper.style.setProperty("--inova-oliv", colors.inova_oliv);
        themeWrapper.style.setProperty("--inova-oliv-medium", colors.inova_oliv_medium);
        themeWrapper.style.setProperty("--inova-oliv-light", colors.inova_oliv_light);

        themeWrapper.style.setProperty("--k-series-a", accent);
        themeWrapper.style.setProperty("--k-series-b", colors.inova_yellow);
        themeWrapper.style.setProperty("--k-series-c", colors.inova_green);
        themeWrapper.style.setProperty("--k-series-d", colors.inova_cyan);
        themeWrapper.style.setProperty("--k-series-e", colors.inova_blue);
        themeWrapper.style.setProperty("--k-series-f", colors.inova_purple);
        themeWrapper.style.setProperty("--k-chart-major-lines", "rgba(0, 0, 0, 0.08)");
        themeWrapper.style.setProperty("--k-chart-minor-lines", "rgba(0, 0, 0, 0.04)");

        themeWrapper.style.setProperty("--color-error", colors.inova_red);
        themeWrapper.style.setProperty("--color-warning", colors.inova_yellow);
        themeWrapper.style.setProperty("--color-success", colors.inova_green);
        themeWrapper.style.setProperty("--color-info", colors.inova_cyan);
    };

    const loadDarkTheme = function (accent: any) {
        const hoveredBg = "#555555";
        loadBaseTheme(accent);
        themeWrapper.style.setProperty("--k-text-color", colors.dark_base_text);
        themeWrapper.style.setProperty("--k-bg-color", colors.dark_base_bg);
        themeWrapper.style.setProperty("--k-base-text", colors.dark_base_text);
        themeWrapper.style.setProperty("--k-base-bg", colors.dark_base_bg);
        themeWrapper.style.setProperty("--k-base-border", colors.dark_base_border);
        themeWrapper.style.setProperty("--k-base-gradient", colors.dark_base_bg + "," + pSBC(-0.02, colors.dark_base_bg));
        themeWrapper.style.setProperty("--k-hovered-text", "#ffffff");
        themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
        themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.15)");
        themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
        themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.1)");
        themeWrapper.style.setProperty("--color-border", colors.dark_base_border);
        themeWrapper.style.setProperty("--color1", colors.dark_base_bg);
        themeWrapper.style.setProperty("--color2", colors.dark_base_bg);
        themeWrapper.style.setProperty("--color3", colors.dark_base_bg);
        themeWrapper.style.setProperty("--color-font", colors.dark_base_text);
        themeWrapper.style.setProperty("--color-icon1", colors.dark_base_text);
        themeWrapper.style.setProperty("--color-icon2", colors.dark_base_text);
        themeWrapper.style.setProperty("--color-widget-inset", "#333");
    };

    const loadOliveTheme = function (accent: any) {
        const hoveredBg = "#efebe6";
        loadBaseTheme(accent);
        themeWrapper.style.setProperty("--k-text-color", colors.light_text_color);
        themeWrapper.style.setProperty("--k-bg-color", colors.light_bg_color);
        themeWrapper.style.setProperty("--k-base-text", colors.light_base_text);
        themeWrapper.style.setProperty("--k-base-bg", colors.light_base_bg);
        themeWrapper.style.setProperty("--k-base-border", "rgba(0,0,0,0.12)");
        themeWrapper.style.setProperty("--k-base-gradient", colors.light_base_bg + "," + pSBC(-0.02, colors.light_base_bg));
        themeWrapper.style.setProperty("--k-hovered-text", "#333333");
        themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
        themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.19)");
        themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
        themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.14)");
        themeWrapper.style.setProperty("--color-border", "#cccccc");
        themeWrapper.style.setProperty("--color1", colors.light_bg_color);
        themeWrapper.style.setProperty("--color2", colors.inova_oliv_light);
        themeWrapper.style.setProperty("--color3", colors.inova_oliv_medium);
        themeWrapper.style.setProperty("--color-font", colors.light_text_color);
        themeWrapper.style.setProperty("--color-icon1", colors.light_text_color);
        themeWrapper.style.setProperty("--color-icon2", colors.light_text_color_inverse);
        themeWrapper.style.setProperty("--color-widget-inset", "#ffffff");
        themeWrapper.style.setProperty("--color-error-light", "#ffe0d9");
        themeWrapper.style.setProperty("--color-warning-light", "#fbeed5");
        themeWrapper.style.setProperty("--color-success-light", "#eaf7ec");
        themeWrapper.style.setProperty("--color-info-light", "#e5f5fa");
    };

    const loadGrayTheme = function (accent: any) {
        const hoveredBg = "#ededed";
        loadOliveTheme(accent);
        themeWrapper.style.setProperty("--k-text-color", colors.gray_text_color);
        themeWrapper.style.setProperty("--k-base-text", colors.gray_base_text);
        themeWrapper.style.setProperty("--k-base-bg", colors.gray_base_bg);
        themeWrapper.style.setProperty("--k-base-border", "rgba(0,0,0,0.08)");
        themeWrapper.style.setProperty("--k-base-gradient", colors.gray_base_bg + "," + pSBC(-0.02, colors.gray_base_bg));
        themeWrapper.style.setProperty("--k-hovered-text", "#656565");
        themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
        themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.15)");
        themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
        themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.1)");
        themeWrapper.style.setProperty("--color-border", "#cccccc");
        themeWrapper.style.setProperty("--color2", "#ebebeb");
        themeWrapper.style.setProperty("--color3", "#cecece");
        themeWrapper.style.setProperty("--color-font", colors.inova_oliv);
    };

    const removeCurrentThemeClass = () => {
        for (let i = 0; i < document.body.classList.length; i++) {
            const c = document.body.classList[i];
            if (c.match("^theme-")) {
                document.body.classList.remove(c);
            }
        }
    };

    const loadDarkBlue = () => {
        loadDarkTheme(colors.inova_blue);
        removeCurrentThemeClass();
        document.body.classList.add("theme-darkblue");
    };
    const loadDarkPink = () => {
        loadDarkTheme(colors.inova_pink);
        removeCurrentThemeClass();
        document.body.classList.add("theme-darkpink");
    };
    const loadGrayBlue = () => {
        loadGrayTheme(colors.inova_blue);
        removeCurrentThemeClass();
        document.body.classList.add("theme-grayblue");
    };
    const loadGrayPink = () => {
        loadGrayTheme(colors.inova_pink);
        removeCurrentThemeClass();
        document.body.classList.add("theme-graypink");
    };
    const loadOliveBlue = () => {
        loadOliveTheme(colors.inova_blue);
        removeCurrentThemeClass();
        document.body.classList.add("theme-oliveblue");
    };
    const loadOlivePink = () => {
        loadOliveTheme(colors.inova_pink);
        removeCurrentThemeClass();
        document.body.classList.add("theme-olivepink");
    };

    /**
     * Veröffentlicht werden die Funktionen um die Jeweiligen Themes zu laden
     */
    return {
        load: function (themeName: string) {
            switch (themeName) {
                case "dark-blue": loadDarkBlue(); break;
                case "dark-pink": loadDarkPink(); break;
                case "gray-blue": loadGrayBlue(); break;
                case "gray-pink": loadGrayPink(); break;
                case "olive-blue": loadOliveBlue(); break;
                case "olive-pink": loadOlivePink(); break;
            }
        },
        loadDarkBlue: loadDarkBlue,
        loadDarkPink: loadDarkPink,
        loadGrayBlue: loadGrayBlue,
        loadGrayPink: loadGrayPink,
        loadOliveBlue: loadOliveBlue,
        loadOlivePink: loadOlivePink,
    };
})();
(<any>window).InovaTheme = InovaTheme;

/**
 * Falls innerhalb des alten inova-Desktops (d.h. wenn inovaGlobal.theme gesetzt ist)
 * wird die entsprechende Theme Funktion aufgerufen.
 * Ansonsten wird das Olive Pink theme aufgerufen.
 */
if ((<any>window).inovaGlobal && (<any>window).inovaGlobal.theme) {
    switch ((<any>window).inovaGlobal.theme) {
        case "OlivePink": InovaTheme.loadOlivePink(); break;
        case "OliveBlue": InovaTheme.loadOliveBlue(); break;
        case "GrayPink": InovaTheme.loadGrayPink(); break;
        case "GrayBlue": InovaTheme.loadGrayBlue(); break;
        case "DarkPink": InovaTheme.loadDarkPink(); break;
        case "DarkBlue": InovaTheme.loadDarkBlue(); break;
    }
} else {
    InovaTheme.loadOlivePink();
}

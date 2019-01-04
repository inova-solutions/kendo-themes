define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InovaTheme = (function () {
        var themeWrapper = document.getElementsByTagName("body")[0];
        var colors = {
            inovaPink: "#e81e75",
            inovaBlue: "#1e98e8",
            inovaOliv: "#564925",
            inovaOlivMedium: "rgb(204, 201, 190)",
            inovaOlivLight: "rgb(236, 232, 226)",
        };
        var pSBCr = undefined;
        // lighten / darken a Color
        // from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
        var pSBC = function (p, from, to) {
            // errorCheck
            if (typeof (p) !== "number" || p < -1 || p > 1 || typeof (from) !== "string"
                || (from[0] !== "r" && from[0] !== "#") || (to && typeof (to) !== "string")) {
                return null;
            }
            var i = parseInt, r = Math.round;
            if (!pSBCr) {
                pSBCr = function (d) {
                    var l = d.length, RGB = {};
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
                    }
                    else {
                        if (l === 8 || l === 6 || l < 4) {
                            return null; // errorCheck
                        }
                        if (l < 6) {
                            d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : ""); // 3 or 4 digit
                        }
                        /* tslint:disable */
                        d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = -1;
                        if (l === 9 || l === 5) {
                            RGB[3] = r((RGB[2] / 255) * 10000) / 10000, RGB[2] = RGB[1], RGB[1] = RGB[0], RGB[0] = d >> 24 & 255;
                        }
                        /* tslint:enable */
                    }
                    return RGB;
                };
            }
            var h = from.length > 9;
            var b = p < 0;
            to = to && to !== "c" ? to : b ? "#000000" : "#FFFFFF";
            var f = pSBCr(from);
            var t = pSBCr(to);
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
            }
            else {
                return "#" + (0x100000000 + r((t[0] - f[0]) * p + f[0]) * 0x1000000
                    + r((t[1] - f[1]) * p + f[1]) * 0x10000
                    + r((t[2] - f[2]) * p + f[2]) * 0x100
                    + (f[3] > -1 && t[3] > -1
                        ? r(((t[3] - f[3]) * p + f[3]) * 255)
                        : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255))
                    .toString(16).slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2);
            }
        };
        var chGcd = function (a, b) {
            // from: http://rosettacode.org/wiki/Greatest_common_divisor#JavaScript
            if (b !== 0) {
                return chGcd(b, a % b);
            }
            else {
                return Math.abs(a);
            }
        };
        var chNthRoot = function (num, n, prec) {
            if (n === undefined) {
                n = 2;
            }
            if (prec === undefined) {
                prec = 12;
            }
            // from: http://rosettacode.org/wiki/Nth_root#JavaScript
            var x = 1;
            for (var i = 0; i <= prec; i++) {
                /* tslint:disable */
                x = 1 / n * ((n - 1) * x + (num / chPow(x, n - 1)));
                /* tslint:enable */
            }
            return x;
        };
        var chPow = function (base, exponent, prec) {
            // handles decimal exponents by trying to convert them into a fraction and then use a nthRoot-algorithm for parts of the calculation
            if (prec === undefined) {
                prec = 12;
            }
            var prec2, denominator;
            if (Math.floor(exponent) !== exponent) {
                prec2 = chPow(10, prec, undefined);
                exponent = Math.round(exponent * prec2);
                denominator = chGcd(exponent, prec2);
                return chNthRoot(chPow(base, exponent / denominator, undefined), prec2 / denominator, prec);
            }
            var value = base;
            if (exponent > 1) {
                for (var i = 2; i <= exponent; i++) {
                    value = value * base;
                }
            }
            else {
                for (var i = 0; i >= exponent; i--) {
                    value = value / base;
                }
            }
            return value;
        };
        var hexToRgb = function (hex) {
            // from https://stackoverflow.com/a/5624139
            // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                m = m;
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        var chColorLuminance = function (color) {
            // adapted from: https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
            // formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            var rgba = [];
            if (color[0] === "#") {
                var comp = hexToRgb(color);
                rgba = [comp.r, comp.g, comp.b];
            }
            else {
                rgba = color.match(/\d+/g);
            }
            var rgba2 = [];
            for (var i = 0; i < 3; i++) {
                var rgb = rgba[i];
                rgb = rgb / 255;
                rgb = rgb < .03928 ? rgb / 12.92 : chPow((rgb + .055) / 1.055, 2.4, 16);
                rgba2.push(rgb);
            }
            return .2126 * rgba2[0] + .7152 * rgba2[1] + 0.0722 * rgba2[2];
        };
        var contrastWcag = function (color) {
            var dark = "#000000", light = "#ffffff";
            var luma = chColorLuminance(color);
            var out = luma < 0.5 ? light : dark;
            return out;
        };
        var loadBaseTheme = function (accent) {
            themeWrapper.style.setProperty("--k-accent", accent);
            themeWrapper.style.setProperty("--k-accent-contrast", contrastWcag(accent));
            themeWrapper.style.setProperty("--k-info", "#3e80ed");
            themeWrapper.style.setProperty("--k-success", "#5ec232");
            themeWrapper.style.setProperty("--k-warning", "#fdce3e");
            themeWrapper.style.setProperty("--k-error", "#d51923");
            themeWrapper.style.setProperty("--k-selected-text", "#ffffff");
            themeWrapper.style.setProperty("--k-selected-bg", accent);
            themeWrapper.style.setProperty("--colorAccent", accent);
            themeWrapper.style.setProperty("--inovaPink", colors.inovaPink);
            themeWrapper.style.setProperty("--inovaBlue", colors.inovaBlue);
            themeWrapper.style.setProperty("--inovaOliv", colors.inovaOliv);
            themeWrapper.style.setProperty("--inovaOlivMedium", colors.inovaOlivMedium);
            themeWrapper.style.setProperty("--inovaOlivLight", colors.inovaOlivLight);
        };
        var loadDarkTheme = function (accent) {
            var baseBg = "#444";
            var hoveredBg = "#555555";
            loadBaseTheme(accent);
            themeWrapper.style.setProperty("--k-text-color", "#ffffff");
            themeWrapper.style.setProperty("--k-bg-color", "#333");
            themeWrapper.style.setProperty("--k-base-text", "#f6f6f6");
            themeWrapper.style.setProperty("--k-base-bg", baseBg);
            themeWrapper.style.setProperty("--k-base-border", "rgba(0,0,0,0.08)");
            themeWrapper.style.setProperty("--k-base-gradient", baseBg + "," + pSBC(-0.02, baseBg));
            themeWrapper.style.setProperty("--k-hovered-text", "#ffffff");
            themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
            themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.15)");
            themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
            themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.1)");
            themeWrapper.style.setProperty("--colorBorder", "rgba(0, 0, 0, 0.1)");
            themeWrapper.style.setProperty("--color1", "#404040");
            themeWrapper.style.setProperty("--color2", "#404040");
            themeWrapper.style.setProperty("--color3", "#404040");
            themeWrapper.style.setProperty("--colorFont", "#eaeaea");
            themeWrapper.style.setProperty("--colorIcon1", "#eaeaea");
            themeWrapper.style.setProperty("--colorIcon2", "#eaeaea");
            themeWrapper.style.setProperty("--colorWidgetInset", "#333");
            themeWrapper.style.setProperty("--colorError", "#e20000");
            themeWrapper.style.setProperty("--colorWarning", "#ffb137");
            themeWrapper.style.setProperty("--colorSuccess", "#2b893c");
            themeWrapper.style.setProperty("--colorInfo", "#0c779b");
        };
        var loadOliveTheme = function (accent) {
            var baseBg = "#f4f2ee";
            var hoveredBg = "#efebe6";
            loadBaseTheme(accent);
            themeWrapper.style.setProperty("--k-text-color", "#333333");
            themeWrapper.style.setProperty("--k-bg-color", "#ffffff");
            themeWrapper.style.setProperty("--k-base-text", "#333333");
            themeWrapper.style.setProperty("--k-base-bg", baseBg);
            themeWrapper.style.setProperty("--k-base-border", "rgba(0,0,0,0.12)");
            themeWrapper.style.setProperty("--k-base-gradient", baseBg + "," + pSBC(-0.02, baseBg));
            themeWrapper.style.setProperty("--k-hovered-text", "#333333");
            themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
            themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.19)");
            themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
            themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.14)");
            themeWrapper.style.setProperty("--colorBorder", "#cccccc");
            themeWrapper.style.setProperty("--color1", "#ffffff");
            themeWrapper.style.setProperty("--color2", colors.inovaOlivLight);
            themeWrapper.style.setProperty("--color3", colors.inovaOlivMedium);
            themeWrapper.style.setProperty("--colorFont", "#000000");
            themeWrapper.style.setProperty("--colorIcon1", "#333333");
            themeWrapper.style.setProperty("--colorIcon2", "#ffffff");
            themeWrapper.style.setProperty("--colorWidgetInset", "#ffffff");
            themeWrapper.style.setProperty("--colorError", "#ffe0d9");
            themeWrapper.style.setProperty("--colorWarning", "#fbeed5");
            themeWrapper.style.setProperty("--colorSuccess", "#eaf7ec");
            themeWrapper.style.setProperty("--colorInfo", "#e5f5fa");
        };
        var loadGrayTheme = function (accent) {
            var baseBg = "#f6f6f6";
            var hoveredBg = "#ededed";
            loadOliveTheme(accent);
            themeWrapper.style.setProperty("--k-text-color", "#656565");
            themeWrapper.style.setProperty("--k-base-text", "#656565");
            themeWrapper.style.setProperty("--k-base-bg", baseBg);
            themeWrapper.style.setProperty("--k-base-border", "rgba(0,0,0,0.08)");
            themeWrapper.style.setProperty("--k-base-gradient", baseBg + "," + pSBC(-0.02, baseBg));
            themeWrapper.style.setProperty("--k-hovered-text", "#656565");
            themeWrapper.style.setProperty("--k-hovered-bg", hoveredBg);
            themeWrapper.style.setProperty("--k-hovered-border", "rgba(black, 0.15)");
            themeWrapper.style.setProperty("--k-hovered-gradient", hoveredBg, pSBC(-0.02, hoveredBg));
            themeWrapper.style.setProperty("--k-selected-border", "rgba(black, 0.1)");
            themeWrapper.style.setProperty("--colorBorder", "#cccccc");
            themeWrapper.style.setProperty("--color2", "#ebebeb");
            themeWrapper.style.setProperty("--color3", "#cecece");
            themeWrapper.style.setProperty("--colorFont", colors.inovaOliv);
        };
        var loadDarkBlue = function () { loadDarkTheme(colors.inovaBlue); };
        var loadDarkPink = function () { loadDarkTheme(colors.inovaPink); };
        var loadGrayBlue = function () { loadGrayTheme(colors.inovaBlue); };
        var loadGrayPink = function () { loadGrayTheme(colors.inovaPink); };
        var loadOliveBlue = function () { loadOliveTheme(colors.inovaOliv); };
        var loadOlivePink = function () { loadOliveTheme(colors.inovaPink); };
        return {
            load: function (themeName) {
                switch (themeName) {
                    case "dark-blue":
                        loadDarkBlue();
                        break;
                    case "dark-pink":
                        loadDarkPink();
                        break;
                    case "gray-blue":
                        loadGrayBlue();
                        break;
                    case "gray-pink":
                        loadGrayPink();
                        break;
                    case "olive-blue":
                        loadOliveBlue();
                        break;
                    case "olive-pink":
                        loadOlivePink();
                        break;
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
    window.InovaTheme = exports.InovaTheme;
});

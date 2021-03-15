
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

let chPow = undefined;

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

chPow = function (base: any, exponent: any, prec?: any) {
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
    hex = hex.replace(
    shorthandRegex,
    function (m: any, r: any, g: any, b: any) {
        m = m;
        return r + r + g + g + b + b;
    }
    );

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

export default {
    pSBCr: pSBCr,
    pSBC: pSBC,
    chGcd: chGcd,
    chPow: chPow,
    chNthRoot: chNthRoot,
    hexToRgb: hexToRgb,
    chColorLuminance: chColorLuminance,
    contrastWcag: contrastWcag
};

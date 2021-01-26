const execSync = require("child_process").execSync;
const ncp = require("ncp").ncp;
const fs = require("fs-extra");
const sass = require("node-sass");
const CleanCSS = require("clean-css");
const distPath = `dist`;
const inovaIconsPath = `../icons/inovaicon.css`;
const origAllScssPath = `../default/scss/all.scss`;
const invoaFontPath = `../default/scss/_inova_font.scss`;
const defaultVariables = `build\\_variables.scss`;
let allScc = "";
let fontFace = null;
let charset = null;
let inovaIconsCss = "";
const themes = ["Dark", "Light"];

try {
    fs.removeSync(`${distPath}`);
} catch (e) {}
fs.mkdirSync(`${distPath}`);

//Read inovaicons css
inovaIconsCss = fs.readFileSync(`${inovaIconsPath}`).toString();

/**
 * The file /scss/variables.css is used by kendo to define the variables per theme.
 * For each theme rename _variables_inova-<theme>.scss to _variables.scss and start
 * npm run build
 */
themes.forEach((theme) => {
    console.log("\x1b[45m\x1b[37m", `Building Theme '${theme}'`, "\x1b[0m");

    const origThemeVars = `scss\\_variables_inova-${theme}.scss`;
    const tmpThemeVars = `scss\\_variables.scss`;
    const tmpAllScssPath = `scss\\orig-all.scss`;
    // const bootstrapFile = `..\\bootstrap-library\\inova-bootstrap.${theme}.scss`;
    // const tmpBootstrapFile = `..\\bootstrap-library\\inova-bootstrap.Current.scss`;

    //rename theme file and start build
    fs.removeSync(tmpThemeVars);
    fs.copyFileSync(origThemeVars, tmpThemeVars);

    //Save original all.scss and wrap all.scss with .theme-dark { EVERYTHING } for the dark theme for example
    fs.copyFileSync(origAllScssPath, tmpAllScssPath);
    let origAllScssContent = fs.readFileSync(origAllScssPath).toString();
    fs.writeFileSync(origAllScssPath, `.theme-${theme.toLowerCase()} {
        ${origAllScssContent}
    }`);

    //Now, use original Kendo Build to compile Scss
    execSync(`npm run sass`, {
        stdio: "inherit",
    });

    //delete temp files again
    fs.copyFileSync(tmpAllScssPath, origAllScssPath);
    fs.unlinkSync(tmpAllScssPath);

    //move generated css to theme output directory
    fs.removeSync(`${distPath}/${theme}`);
    fs.mkdirSync(`${distPath}/${theme}`);
    fs.renameSync(`${distPath}/all.css`, `${distPath}/${theme}/all.css`);

    let css = fs.readFileSync(`${distPath}/${theme}/all.css`).toString();

    //Extract @font-face and add it later so it is defined only once
    const ffStart = css.indexOf("@font-face");
    const ffEnd = css.indexOf("}", ffStart + 1);
    if (fontFace === null) {
        fontFace = css.slice(ffStart, ffEnd + 1);
        // Remove .theme-dark from @font-face
        const tStart = fontFace.indexOf(".theme-dark");
        const tEnd = fontFace.indexOf("{", tStart + 1);
        fontFace = fontFace.slice(0, tStart) + fontFace.slice(tEnd + 1);
    }
    css = css.slice(0, ffStart) + css.slice(ffEnd + 1);

    //Extract @charset and add it later so it is defined only once
    const ccStart = css.indexOf("@charset");
    const ccEnd = css.indexOf(";", ccStart);
    if(charset === null) {
        charset = css.slice(ccStart, ccEnd + 1);
    }
    css = css.slice(0, ccStart) + css.slice(ccEnd + 1);

    allScc += css;

    //create _variables.scss per theme
    let origThemeVarsContent = fs.readFileSync(origThemeVars).toString();
    origThemeVarsContent = origThemeVarsContent.replace(
        /@import '/g,
        `@import '../common/scss/`
    );
    origThemeVarsContent = origThemeVarsContent.replace(
        /@import "/g,
        `@import "../common/scss/`
    );
    fs.writeFileSync(
        `${distPath}/${theme}/_variables.scss`,
        origThemeVarsContent
    );
});

fs.writeFileSync(
    `${distPath}/_variables.scss`,
    fs.readFileSync(defaultVariables).toString()
);

// read font.scss
const inovaFont = fs.readFileSync(invoaFontPath).toString();

fs.writeFileSync(
    `${distPath}/test.scss`, allScc
);

let finalCss = allScc;

finalCss = charset + `\n` + inovaFont + " " + fontFace + " " + finalCss;
finalCss += " " + inovaIconsCss;
fs.writeFileSync(`${distPath}/all.css`, finalCss);
fs.writeFileSync(
    `${distPath}/all.min.css`,
    new CleanCSS({}).minify(finalCss).styles
);

//create package.json
fs.copyFileSync(`build/inova-themes-package.json`, `${distPath}/package.json`);

//build and copy InovaTheme js to dist
try {
    execSync(`tsc scripts/InovaTheme.ts -m "system" -t "es5"`, {
        stdio: "inherit",
    });
} catch (e) {}

fs.copyFileSync(`scripts/InovaTheme.js`, `${distPath}/InovaTheme.js`);
fs.removeSync(`scripts/InovaTheme.js`);

//copy all scss files to dist
fs.removeSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common/scss`);
ncp(`scss`, `${distPath}/common/scss`, function (err) {
    //Create shortcut to themify.scss
    fs.writeFileSync(
        `${distPath}/themify.scss`,
        `@import 'common/scss/themify';`
    );

    console.log("\n", "\x1b[42m\x1b[37m", `Build Successful!`, "\x1b[0m");
});

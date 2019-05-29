const execSync = require('child_process').execSync;
const ncp = require('ncp').ncp;
const fs = require('fs-extra');
const sass = require('node-sass');
const CleanCSS = require('clean-css');
const distPath = `dist`;
const inovaIconsPath = `../icons/inovaicon.css`
const defaultVariables = `build\\_variables.scss`;
let allScss = '';
let fontFace = null;
let inovaIconsCss = '';
const themes = [
    'OlivePink',
    // 'OliveBlue',
    'GrayPink',
    // 'GrayBlue',
    'DarkPink',
    // 'DarkBlue'
];

//Read inovaicons css
inovaIconsCss = fs.readFileSync(`${inovaIconsPath}`).toString();

/**
 * The file /scss/variables.css is used by kendo to define the variables per theme.
 * For each theme rename _variables_inova-<theme>.scss to _variables.scss and start
 * npm run build
 */
themes.forEach(theme => {
    console.log('\x1b[45m\x1b[37m', `Building Theme '${theme}'`, '\x1b[0m');

    const origThemeVars = `scss\\_variables_inova-${theme}.scss`;
    const tmpThemeVars = `scss\\_variables.scss`;

    //rename theme file and start build
    fs.removeSync(tmpThemeVars);
    fs.copyFileSync(origThemeVars, tmpThemeVars);
    execSync(`npm run build`, {
        stdio: 'inherit'
    });

    //delete unnecessary files
    fs.unlinkSync(tmpThemeVars);

    //move generated css to theme output directory
    fs.removeSync(`${distPath}/${theme}`);
    fs.mkdirSync(`${distPath}/${theme}`);
    fs.renameSync(`${distPath}/all.css`, `${distPath}/${theme}/all.css`);

    //Remove Font-Face definitions and add it only once (outside of theme wrapper)
    let css = fs.readFileSync(`${distPath}/${theme}/all.css`).toString();
    const ffStart = css.indexOf("@font-face");
    const ffEnd = css.indexOf("}", ffStart + 1);
    if (fontFace === null) {
        fontFace = css.slice(ffStart, ffEnd + 1);
    }
    css = css.slice(0, ffStart) + css.slice(ffEnd + 1);

    //wrap themes with a css class .theme-<themename> and concatenate all
    allScss += `.theme-${theme.toLowerCase()} {
      ${css}
    }`;

    //create _variables.scss per theme
    let origThemeVarsContent = fs.readFileSync(origThemeVars).toString();
    origThemeVarsContent = origThemeVarsContent.replace(
        /@import '/g,
        "@import '../common/scss/"
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

//compile css with all themes
let allCss = sass.renderSync({
    data: allScss
}).css;
allCss = fontFace + ' ' + allCss;
allCss += ' ' + inovaIconsCss;
fs.writeFileSync(`${distPath}/all.css`, allCss);
fs.writeFileSync(`${distPath}/all.min.css`, new CleanCSS({}).minify(allCss).styles);

//create package.json
fs.copyFileSync(`build/inova-themes-package.json`, `${distPath}/package.json`);

//build and copy InovaTheme js to dist
execSync(`tsc scripts/InovaTheme.ts -m "es2015" -t "es5"`, {
    stdio: 'inherit'
});
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

    console.log('\n', '\x1b[42m\x1b[37m', `Build Successful!`, '\x1b[0m');
});

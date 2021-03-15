
const fs = require("fs-extra");
const execSync = require("child_process").execSync;
const sass = require("node-sass");
const CleanCSS = require("clean-css");
const prompt = require('prompt');
const ncp = require("ncp").ncp;

const PATHS = {
    DIST: `dist`,
    SCRIPTS: `scripts`,
    FONT: `scss/_inova_font.scss`,
    ICON: `icons`,
    ICONS_OUTPUT: `icons/inovaicon.css`,
    OUTPUT_DEFAULT: `dist/all.css`,
    OUTPUT_MINIFIED: `dist/all.min.css`
}

const themes = ['Light', 'Dark'];

/**
 * Build Ablauf
 */
const run = () => {

    let charset = '';

    cleanDir(PATHS.DIST);

    buildKendoSwatchThemes();

    themes.forEach(theme => {
        writeInfo('Building Theme ' + theme);
        createLegacyThemeOutput(theme);
        charset = extractCharset(theme);
        interpolateMax(theme);
        wrapWithThemePrefix(theme);
        charset = extractCharset(theme);
    });

    writeInfo('Finalize');

    compileInovaIcons();

    const inovaFont = readFile(PATHS.FONT);
    const inovaIcons = readFile(PATHS.ICONS_OUTPUT);
    const mainCss = combineThemes();

    const finalCss = `
        ${charset}
        ${inovaFont}
        ${mainCss}
        ${inovaIcons}
    `;

    writeLog('Create Default Css');
    writeFile(PATHS.OUTPUT_DEFAULT, finalCss);

    writeLog('Create Minified Css');
    const minifiedCss = new CleanCSS({}).minify(finalCss).styles;
    writeFile(PATHS.OUTPUT_MINIFIED, minifiedCss);

    createInovaThemeJs();

    copyKendoSassFile(() => {
        cleanUpDist();
        createPackageJson();
        writeSuccess('Build Successful! 🎉');
        publishHelper();
    });
}

/**
 * Helper Functions
 */
const writeLog = (msg) => console.log(`\n${msg}`);
const writeInfo = (msg) => console.log(`\n\x1b[45m\x1b[37m${msg}\x1b[0m`);
const writeSuccess = (msg) => console.log(`\n\x1b[42m\x1b[37m${msg}\x1b[0m`);
const exec = (cmd, returnVal) => {
    if(returnVal === true) return execSync(cmd);
    else execSync(cmd, { stdio: "inherit"});
};
const deletePath = (path) => { try { fs.removeSync(path); } catch (e) {} };
const readFile = (path) => fs.readFileSync(path).toString();
const writeFile = (path, content) => fs.writeFileSync(path, content);
const getDistForTheme = (theme) => `${PATHS.DIST}/inova-${theme.toLowerCase()}.css`
const cleanDir = (path) => {
    writeLog('clean dir: ' + path);
    deletePath(path);
    fs.mkdirSync(path);
}

/**
 * Buildet die Kendo Swatch Themes gemäss
 * https://www.telerik.com/kendo-angular-ui/components/styling/custom-themes/#toc-using-the-build-process-of-the-themes
 */
const buildKendoSwatchThemes = () => {
    writeLog('build kendo swatch themes');
    exec(`npm run sass:swatches`);
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
 const occurrences = (string, subString, allowOverlapping) => {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

/**
 * Extrahiert Charset Definition von Theme Css und gibt sie zurück
 * @param {string} theme
 * @returns charset definition
 */
const extractCharset = (theme) => {
    writeLog('Extracting Charset');
    const path = getDistForTheme(theme);
    let css = readFile(path);
    const charsetStart = css.indexOf("@charset");
    const charsetEnd = css.indexOf(";", charsetStart);
    const charset = css.slice(charsetStart, charsetEnd + 1);
    css = css.slice(0, charsetStart) + css.slice(charsetEnd + 1);
    writeFile(path, css);
    return charset;
}

/**
 * Wrappt max-Funktionen in eine String-Interpolation, um einen Fehler in SASS zu vermeiden
 * Beschreibung https://github.com/sass/node-sass/issues/2815#issuecomment-574038619
 * @param {string} theme
 */
const interpolateMax = (theme) => {
    const path = getDistForTheme(theme);
    writeLog('Interpolate Max Functions');
    let css = readFile(path);
    css = css
        .split("\n")
        .map(line => {
            if(line.indexOf(' max(') >= 0){
                const maxStart = line.indexOf("max(");
                const maxEnd = line.indexOf(")", maxStart);
                const beforeMax = line.slice(0, maxStart);
                const afterMax = line.slice(maxEnd + 1);
                const maxContent = line.slice(maxStart, maxEnd + 1);
                const interpolatedMaxContent = `#{"${maxContent}"}`;
                const interpolatedLine = beforeMax + interpolatedMaxContent + afterMax;
                return interpolatedLine;
            } else {
                return line;
            }
        })
        .join("\n");
    writeFile(path, css);
}

/**
 * Wrappt die Theme Css mit dem entsprechenden prefix des Themes
 * z.B.: .theme-light { XXX }
 * und buildet mit Sass ein neues Css
 * @param {string} theme
 */
const wrapWithThemePrefix = (theme) => {
    writeLog('Wrap Css with theme prefix');
    const path = getDistForTheme(theme);
    const themeClass = `.theme-${theme.toLowerCase()}`;
    const css = readFile(path);
    const wrappedScss = `${themeClass} {
        ${css}
    }`;
    const wrappedCss = sass.renderSync({ data: wrappedScss }).css;

    //Remove .theme-XXX from @font-face definition
    const ffStart = wrappedCss.indexOf("@font-face");
    const ffClassHeadStart = wrappedCss.indexOf(themeClass, ffStart + 1);
    const ffClassHeadEnd = wrappedCss.indexOf('{', ffClassHeadStart + 1);
    const ffClassTailStart = wrappedCss.indexOf('}', ffClassHeadEnd);
    const finalCss = wrappedCss.slice(0,ffClassHeadStart)
                    + wrappedCss.slice(ffClassHeadEnd + 2, ffClassTailStart)
                    + wrappedCss.slice(ffClassTailStart + 2);

    writeFile(path, finalCss);
}

/**
 * Kombiniert die Theme Css zu einem
 * @returns {string} das kombinierte css
 */
const combineThemes = () => {
    writeLog('Combine themes');
    let css = '';
    themes.forEach(theme => {
        css += "\n" + readFile(getDistForTheme(theme));
    });

    //Remove duplicate Definition of @font-face
    while(occurrences(css, '@font-face') > 1) {
        const ffStart = css.indexOf("@font-face");
        const ffEnd = css.indexOf('}', ffStart + 1);
        css = css.slice(0, ffStart)
            + css.slice(ffEnd + 2);
    }

    return css;
}

/**
 * Fügt die Icon Font als Base64 Encoded String als source ein
 */
const compileInovaIcons = () => {
    writeLog("Compile Inova Icon Css");
    const font = fs.readFileSync(`${PATHS.ICON}/inovaicon/fonts/inovaicon.woff`);
    const fontBase64 = font.toString('base64');
    const ffTemplate = readFile(`${PATHS.ICON}/fontface_template`);
    let css = readFile(`${PATHS.ICON}/inovaicon/style.css`);
    let newSource = ffTemplate.replace('ENTER_BASE64_FONT_FILE_HERE', fontBase64);

    //Remove FontFace Source
    const startFfSource = css.indexOf('src:', 0);
    const endFfSource = css.indexOf(';', startFfSource + 1);
    css = css.slice(0, startFfSource)
        + newSource
        + css.slice(endFfSource + 2);

    writeFile(`${PATHS.ICONS_OUTPUT}`, css);
}

/**
 * Erstellt das JS File zum wechseln der CSS Variablen für die Inova Styles
 */
const createInovaThemeJs = () => {
    writeInfo("Creating InovaTheme.js");
    try {
        execSync(`tsc ${PATHS.SCRIPTS}/InovaTheme.ts -m "system" -t "es5"`, {
            stdio: "inherit",
        });
    } catch (e) {}
    fs.copyFileSync(`${PATHS.SCRIPTS}/InovaTheme.js`, `${PATHS.DIST}/InovaTheme.js`);
    fs.removeSync(`${PATHS.SCRIPTS}/InovaTheme.js`);
}

/**
 * Kopiert die zusätzlichen Kendo Sass Files ins Dist Verzeichnis
 */
const copyKendoSassFile = (done) => {
    fs.mkdirSync(`${PATHS.DIST}/common`);
    fs.mkdirSync(`${PATHS.DIST}/common/scss`);
    ncp(`scss`, `${PATHS.DIST}/common/scss`, function (err) {
        if(done) { done(); }
    });
}

/**
 * Erstellt die Files für die Legacy Projekte (InovaFisWeb)
 */
 const createLegacyThemeOutput = (theme) => {
    writeLog('Create Legacy Css');
    let legacyThemeName  = '';
    switch(theme) {
        case 'Light': legacyThemeName = 'OlivePink'; break;
        case 'Dark': legacyThemeName = 'DarkPink'; break;
    }
    const src = `${PATHS.DIST}/inova-${theme}.css`;
    const destDir = `${PATHS.DIST}/${legacyThemeName}`;
    const dest = `${destDir}/all.css`;
    fs.mkdirSync(destDir);
    const css = readFile(src);
    const minifiedCss = new CleanCSS({}).minify(css).styles;
    writeFile(dest, minifiedCss);
}

/**
 * Entfernt alle nicht benötigten Files
 */
const cleanUpDist = () => {
    writeLog('Clean up dist directory');
    themes.forEach(theme => deletePath(`${PATHS.DIST}/inova-${theme}.css`));
    deletePath(`${PATHS.DIST}/all.scss`);
}

/**
 * Erstellt das Package Json mit der nächsten Versionsnummer
 */
const createPackageJson = () => {
    writeLog('Create package.json with next version number');
    const path = `${PATHS.DIST}/package.json`;
    fs.copyFileSync(`build/inova-themes-package.json`, path);
    const json = JSON.parse(readFile(path));
    let currentVersion = exec(`npm show ${json.name} version`, true).toString().split(".");
    currentVersion[2] = parseInt(currentVersion[2]) + 1;
    json.version = currentVersion.join(".");
    writeFile(path, JSON.stringify(json, null, 2));
}

/**
 * Gibt infos zum Publish an und stellt die frage, ob man es gleich publishen will
 */
const publishHelper = () => {
    prompt.start();
    const question = 'Do you want to publish now? (y/n)';
    prompt.get([question], function (err, result) {
        if (err) { return 1; }
        if(result[question].toLowerCase() === 'y'){
            exec(`npm publish ${PATHS.DIST}`);
        } else {
            writeLog('To publish, run following command: \n\nnpm publish ' + process.cwd() + '\\' + PATHS.DIST + '\n');
        }
    });
}

run();

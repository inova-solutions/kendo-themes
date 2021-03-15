const B = require("./build-helpers.js");

const PATHS = {
    DIST: `dist`,
    SCRIPTS: `scripts`,
    SCRIPTS_OUTPUT: `dist/InovaTheme.js`,
    FONT: `scss/_inova_font.scss`,
    ICON: `icons`,
    ICONS_OUTPUT: `icons/inovaicon.css`,
    OUTPUT_DEFAULT: `dist/all.css`,
    OUTPUT_MINIFIED: `dist/all.min.css`
}

const themes = ['Light', 'Dark'];

let charset = '';

B.cleanDir(PATHS.DIST);

//Kendo Swatch Build
B.buildKendoSwatchThemes();

//Themes wrappen in theme Klassen
themes.forEach(theme => {
    B.writeInfo('Building Theme ' + theme);
    //Legacy Files erstellen für FIS WEB Desktop
    B.createLegacyThemeOutput(theme, PATHS.DIST);
    charset = B.extractCharset(theme, PATHS.DIST);
    B.interpolateMax(theme, PATHS.DIST);
    B.wrapWithThemePrefix(theme, PATHS.DIST);
    charset = B.extractCharset(theme, PATHS.DIST);
});

//Alles Css zusammenführen
B.writeInfo('Finalize');
B.compileInovaIcons(PATHS.ICON, PATHS.ICONS_OUTPUT);
const inovaFont = B.readFile(PATHS.FONT);
const inovaIcons = B.readFile(PATHS.ICONS_OUTPUT);
const mainCss = B.combineThemes(themes, PATHS.DIST);
const finalCss = `
    ${charset}
    ${inovaFont}
    ${mainCss}
    ${inovaIcons}
`;
B.writeLog('Create Default Css');
B.writeFile(PATHS.OUTPUT_DEFAULT, finalCss);
B.writeLog('Create Minified Css');
B.writeFile(PATHS.OUTPUT_MINIFIED, B.minify(finalCss));

//InovaTheme.js builden
B.createInovaThemeJs(PATHS.SCRIPTS, PATHS.SCRIPTS_OUTPUT);

//Build Output aufräumen und finalisieren
B.copyKendoSassFile(() => {
    B.cleanUpDist(themes, PATHS.DIST);
    B.createPackageJson(PATHS.DIST);
    B.writeSuccess('Build Successful! 🎉');
    B.publishHelper(PATHS.DIST);
}, PATHS.DIST);

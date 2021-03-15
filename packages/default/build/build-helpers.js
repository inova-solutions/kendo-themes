const fs = require("fs-extra");
const execSync = require("child_process").execSync;
const sass = require("node-sass");
const prompt = require('prompt');
const ncp = require("ncp").ncp;
const CleanCSS = require("clean-css");

/**
 * Helper Functions
 */
 exports.writeLog = (msg) => console.log(`\n${msg}`);
 exports.writeInfo = (msg) => console.log(`\n\x1b[45m\x1b[37m${msg}\x1b[0m`);
 exports.writeSuccess = (msg) => console.log(`\n\x1b[42m\x1b[37m${msg}\x1b[0m`);
 exports.exec = (cmd, returnVal) => {
     if(returnVal === true) return execSync(cmd);
     else execSync(cmd, { stdio: "inherit"});
 };
 exports.deletePath = (path) => { try { fs.removeSync(path); } catch (e) {} };
 exports.readFile = (path) => fs.readFileSync(path).toString();
 exports.writeFile = (path, content) => fs.writeFileSync(path, content);
 exports.getThemeFile = (theme, distPath) => `${distPath}/inova-${theme.toLowerCase()}.css`
 exports.cleanDir = (path) => {
     this.writeLog('clean dir: ' + path);
     this.deletePath(path);
     fs.mkdirSync(path);
 }

 /**
  * Buildet die Kendo Swatch Themes gemäss
  * https://www.telerik.com/kendo-angular-ui/components/styling/custom-themes/#toc-using-the-build-process-of-the-themes
  */
  exports.buildKendoSwatchThemes = () => {
     this.writeLog('build kendo swatch themes');
     this.exec(`npm run sass:swatches`);
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
  exports.occurrences = (string, subString, allowOverlapping) => {

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
  exports.extractCharset = (theme, distPath) => {
     this.writeLog('Extracting Charset');
     const path = this.getThemeFile(theme, distPath);
     let css = this.readFile(path);
     const charsetStart = css.indexOf("@charset");
     const charsetEnd = css.indexOf(";", charsetStart);
     const charset = css.slice(charsetStart, charsetEnd + 1);
     css = css.slice(0, charsetStart) + css.slice(charsetEnd + 1);
     this.writeFile(path, css);
     return charset;
 }

 /**
  * Wrappt max-Funktionen in eine String-Interpolation, um einen Fehler in SASS zu vermeiden
  * Beschreibung https://github.com/sass/node-sass/issues/2815#issuecomment-574038619
  * @param {string} theme
  */
exports.interpolateMax = (theme, distPath) => {
     const path = this.getThemeFile(theme, distPath);
     this.writeLog('Interpolate Max Functions');
     let css = this.readFile(path);
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
     this.writeFile(path, css);
 }

 /**
  * Wrappt die Theme Css mit dem entsprechenden prefix des Themes
  * z.B.: .theme-light { XXX }
  * und buildet mit Sass ein neues Css
  * @param {string} theme
  */
exports.wrapWithThemePrefix = (theme, path) => {
     this.writeLog('Wrap Css with theme prefix');
     const themePath = this.getThemeFile(theme, path);
     const themeClass = `.theme-${theme.toLowerCase()}`;
     const css = this.readFile(themePath);
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

     this.writeFile(themePath, finalCss);
 }

 /**
  * Kombiniert die Theme Css zu einem
  * @returns {string} das kombinierte css
  */
exports.combineThemes = (themes, path) => {
     this.writeLog('Combine themes');
     let css = '';
     themes.forEach(theme => {
         css += "\n" + this.readFile(this.getThemeFile(theme, path));
     });

     //Remove duplicate Definition of @font-face
     while(this.occurrences(css, '@font-face') > 1) {
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
exports.compileInovaIcons = (source, output) => {
     this.writeLog("Compile Inova Icon Css");
     const font = fs.readFileSync(`${source}/inovaicon/fonts/inovaicon.woff`);
     const fontBase64 = font.toString('base64');
     const ffTemplate = this.readFile(`${source}/fontface_template`);
     let css = this.readFile(`${source}/inovaicon/style.css`);
     let newSource = ffTemplate.replace('ENTER_BASE64_FONT_FILE_HERE', fontBase64);

     //Remove FontFace Source
     const startFfSource = css.indexOf('src:', 0);
     const endFfSource = css.indexOf(';', startFfSource + 1);
     css = css.slice(0, startFfSource)
         + newSource
         + css.slice(endFfSource + 2);

     this.writeFile(output, css);
 }

 /**
  * Erstellt das JS File zum wechseln der CSS Variablen für die Inova Styles
  */
exports.createInovaThemeJs = (source, output) => {
     this.writeInfo("Creating InovaTheme.js");
     try {
         execSync(`tsc ${source}/InovaTheme.ts -m "system" -t "es5"`, {
             stdio: "inherit",
         });
     } catch (e) {}
     fs.copyFileSync(`${source}/InovaTheme.js`, output);
     fs.removeSync(`${source}/InovaTheme.js`);
     fs.removeSync(`${source}/SassHelpers.js`);
 }

 /**
  * Kopiert die zusätzlichen Kendo Sass Files ins Dist Verzeichnis
  */
exports.copyKendoSassFile = (done, path) => {
     fs.mkdirSync(`${path}/common`);
     fs.mkdirSync(`${path}/common/scss`);
     ncp(`scss`, `${path}/common/scss`, function (err) {
         if(done) { done(); }
     });
 }

 /**
  * Erstellt die Files für die Legacy Projekte (InovaFisWeb)
  */
exports.createLegacyThemeOutput = (theme, path) => {
     this.writeLog('Create Legacy Css');
     let legacyThemeDir  = '';
     switch(theme) {
         case 'Light': legacyThemeDir = 'OlivePink'; break;
         case 'Dark': legacyThemeDir = 'DarkPink'; break;
     }
     const src = `${path}/inova-${theme}.css`;
     const destDir = `${path}/${legacyThemeDir}`;
     const dest = `${destDir}/all.css`;
     fs.mkdirSync(destDir);
     const css = this.readFile(src);
     const minifiedCss = this.minify(css);
     this.writeFile(dest, minifiedCss);
 }

 /**
  * Entfernt alle nicht benötigten Files
  */
  exports.cleanUpDist = (themes, path) => {
     this.writeLog('Clean up dist directory');
     themes.forEach(theme => this.deletePath(`${path}/inova-${theme}.css`));
     this.deletePath(`${path}/all.scss`);
 }

 /**
  * Erstellt das Package Json mit der nächsten Versionsnummer
  */
  exports.createPackageJson = (path) => {
     this.writeLog('Create package.json with next version number');
     const pkgPath = `${path}/package.json`;
     fs.copyFileSync(`build/inova-themes-package.json`, pkgPath);
     const json = JSON.parse(this.readFile(pkgPath));
     let currentVersion = this.exec(`npm show ${json.name} version`, true).toString().split(".");
     currentVersion[2] = parseInt(currentVersion[2]) + 1;
     json.version = currentVersion.join(".");
     this.writeFile(pkgPath, JSON.stringify(json, null, 2));
 }

 /**
  * Minifies a CSS Text
  */
 exports.minify = (css) => {
     return new CleanCSS({}).minify(css).styles;
 }

 /**
  * Gibt infos zum Publish an und stellt die frage, ob man es gleich publishen will
  */
  exports.publishHelper = (path) => {
     prompt.start();
     const question = 'Do you want to publish now? (y/n)';
     const exec = this.exec;
     const writeLog = this.writeLog;
     prompt.get([question], function (err, result) {
         if (err) { return 1; }
         if(result[question].toLowerCase() === 'y'){
            exec(`npm publish ${path}`);
         } else {
             writeLog('To publish, run following command: \n\nnpm publish ' + process.cwd() + '\\' + path + '\n');
         }
     });
 }

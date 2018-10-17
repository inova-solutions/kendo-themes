const execSync = require('child_process').execSync;
const ncp = require('ncp').ncp;
const fs = require('fs-extra');
const sass = require('node-sass');
const distPath = `dist`;
let allScss = '';
const themes = [
  'OlivePink',
  'OliveBlue',
  'GrayPink',
  'GrayBlue',
  'DarkPink',
  'DarkBlue'
];

themes.forEach(theme => {
  console.log('\x1b[45m\x1b[37m', `Building Theme '${theme}'`, '\x1b[0m');
  const origThemeVars = `scss\\_variables_inova-${theme}.scss`;
  const tmpThemeVars = `scss\\_variables.scss`;
  const distThemeVars = `${distPath}/kendo.custom.${theme}.css`;

  //process.env.npm_package_main = `dist/kendo-${theme}.css`;

  //Clear existing Temp file
  execSync(`if exist ${tmpThemeVars} del /S/Q ${tmpThemeVars}`);

  //Copy scss for theme to tmpPath
  fs.copyFileSync(origThemeVars, tmpThemeVars);

  //Execute Build
  execSync(`npm run build`, {
    stdio: 'inherit'
  });

  //Delete Unneccesary Files
  fs.unlinkSync(tmpThemeVars);
  fs.unlinkSync(`${distPath}/all.js`);

  //Rename and move generated css to theme dir
  fs.removeSync(`${distPath}/${theme}`);
  fs.mkdirSync(`${distPath}/${theme}`);
  fs.renameSync(`${distPath}/all.css`, `${distPath}/${theme}/all.css`);
  //todo: evtl. ohne Prefix für olive-pink, da default
  allScss += `.theme-${theme.toLowerCase()} {
    ${fs.readFileSync(`${distPath}/${theme}/all.css`).toString()}
  }`;

  // todo: copy scss dir
  let origThemeVarsContent = fs.readFileSync(origThemeVars).toString();
  origThemeVarsContent = origThemeVarsContent.replace(
    /@import '/g,
    "@import '../common/scss/"
  );
  fs.writeFileSync(`${distPath}/${theme}/variables.scss`, origThemeVarsContent);
});

//Create css with all themes
const allCss = sass.renderSync({
  data: allScss
}).css;
fs.writeFileSync(`${distPath}/all.css`, allCss);

//Copy Package json to dist
fs.copyFileSync(`build/inova-themes-package.json`, `${distPath}/package.json`);

//scss Files nach dist kopieren
fs.removeSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common/scss`);
ncp(`scss`, `${distPath}/common/scss`, function(err) {
  //Create global themify
  fs.writeFileSync(
    `${distPath}/themify.scss`,
    `@import 'common/scss/themify';`
  );

  console.log('Build Successful');
});

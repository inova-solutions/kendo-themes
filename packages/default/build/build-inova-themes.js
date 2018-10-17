const execSync = require('child_process').execSync;
var ncp = require('ncp').ncp;
var fs = require('fs-extra');
const distPath = `dist`;
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

  // todo: copy scss dir
  let origThemeVarsContent = fs.readFileSync(origThemeVars).toString();
  origThemeVarsContent = origThemeVarsContent.replace(
    /@import '/g,
    "@import '../common/scss/"
  );
  fs.writeFileSync(`${distPath}/${theme}/variables.scss`, origThemeVarsContent);
});

//scss Files nach dist kopieren
fs.removeSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common`);
fs.mkdirSync(`${distPath}/common/scss`);
ncp(`scss`, `${distPath}/common/scss`, function(err) {
  console.log('Build Successful');
});

//Create global themify
fs.writeFileSync(`${distPath}/themify.scss`, `@import 'common/scss/themify';`);

//Copy Package json to dist
fs.copyFileSync(`build/inova-themes-package.json`, `${distPath}/package.json`);

//Publish Package

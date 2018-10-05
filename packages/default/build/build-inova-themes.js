const execSync = require('child_process').execSync;
const fs = require('fs');
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
  const origPath = `scss\\_variables_inova-${theme}.scss`;
  const tmpPath = `scss\\_variables.scss`;
  const distPath = `dist`;
  //process.env.npm_package_main = `dist/kendo-${theme}.css`;
  execSync(`if exist ${tmpPath} del /S/Q ${tmpPath}`);
  fs.copyFileSync(origPath, tmpPath);
  execSync(`npm run build`, {
    stdio: 'inherit'
  });
  fs.unlinkSync(tmpPath);
  fs.renameSync(`${distPath}/all.css`, `${distPath}/kendo.custom.${theme}.css`);
});

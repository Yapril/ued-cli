const {prompt} = require('inquirer')
const {writeFile} = require('fs')
const {resolve} = require('path')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

const question = [
  {
    type: 'input',
    name: 'project',
    message: '输入项目名称:',
    validate(val) {
      if (val !== '') {
        return true
      }
      return '项目名称不能为空!'
    }
  }, 
  {
    type: 'list',
    name: 'name',
    message: '选择模板:',
    choices: ['PC端', '移动端']
  }
]

//根据选择修改gulpfile文件
function rwGulpfile(dir,str) {
  var writeFileName = dir + '/gulpfile.js'
  writeFile(writeFileName, str, {"encoding": 'utf8'}, function(err,data) {
    if (err) {throw err}
  })
}

module.exports = prompt(question).then(({name, project}) => {
  const spinner = ora('模板下载中，请稍候...')

  spinner.start()
  download('Yapril/ued-tmpl', `${project}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    spinner.stop()
    switch (`${name}`) {
      case 'PC端':
        var pcGulpfile = "require('gulp-uedtask').run();";
        rwGulpfile(`${project}`, pcGulpfile);
        console.log(chalk.green('\n   PC端项目已经成功初始化'));
        console.log(chalk.green('\n   如需开始请输入以下命令：'));
        console.log(chalk.blue('\n           cd ' + `${project}` + '\n           npm install --save-dev gulpjs/gulp#4.0 meltifa/gulp-uedtask#gulp4'));
        break;
      case '移动端':
        var wapGulpfile = "require('gulp-uedtask').run({useRetina: true,divideBy2: true});";
        rwGulpfile(`${project}`, wapGulpfile);
        console.log(chalk.green('\n   移动端项目已经成功初始化'));
        console.log(chalk.green('\n   如需开始请输入以下命令：'));
        console.log(chalk.blue('\n           cd ' + `${project}` + '\n           npm install --save-dev gulpjs/gulp#4.0 meltifa/gulp-uedtask#gulp4'));
        break;
    }
  })
})

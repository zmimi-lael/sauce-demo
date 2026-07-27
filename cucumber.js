module.exports = {
  default: {
    requireModule: [],
    require: [
      'support/**/*.js',
      'ui/steps/**/*.js'
    ],
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1,          // increase when ready for parallel runs
    retry: 0,
    publishQuiet: true,
    worldParameters: {}
  }
};
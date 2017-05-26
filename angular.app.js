var app = angular.module("executor.app", []);

app.controller("#content.controller", ["$scope", "executorService", function($scope, executorService){
  this.history = [];
  this.run = function () {
    executorService.exec(this.cmd, this.cwd).then((result) => {
      console.log(result.stdout)
      this.history.push(result);
      $scope.$apply();
    }, (error) => {
      console.error(error)
    });
  };
}]);

app.factory("executorService", function() {
  const exec = require('child_process').exec;
  var executorService = {
    exec: (cmd, cwd) => new Promise((resolve, reject) => {
      var options = {};
      if (cwd) options.cwd = cwd;
      exec(cmd, options, (error, stdout, stderr) => {
        resolve(commandExecutionResult(cwd, cmd, stdout, stderr, error));
      });
    })
  };
  return executorService;
});

function commandExecutionResult(cwd, cmd, stdout, stderr, error) {
    return {
      cwd: cwd,
      cmd: cmd,
      stdout: stdout,
      stderr: stderr,
      error: error
    };
}

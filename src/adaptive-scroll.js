(function () {

var adaptive = angular.module('adaptive.scroll', []);

adaptive.factory('$gyroscope', ['$rootScope', function ($rootScope) {

  var alphaStart, betaStart, gammaStart;
  var alpha, beta, gamma;
  var trashold = 20;
  var active;

  window.ondeviceorientation = function(event) {
    alpha = Math.round(event.alpha);
    beta = Math.round(event.beta);
    gamma = Math.round(event.gamma);

    if (active && Math.abs(alphaStart - alpha) > trashold) {
      sendEvent();
    }
  };

  var sendEvent = function() {
    var alphaDiff = (alphaStart - alpha);
    var betaDiff = (betaStart - beta);
    var gammaDiff = (gammaStart - gamma);
    $rootScope.$broadcast('adaptive.scroll:deviceorientation', {'alphaDiff': alphaDiff, 'betaDiff': betaDiff, 'gammaDiff': gammaDiff});
  };

  var start = function(degrees) {
    alphaStart = alpha;
    betaStart = beta;
    gammaStart = gamma;
    trashold = degrees || trashold;
    active = true;
  };

  var stop = function() {
    alphaStart = alpha;
    betaStart = beta;
    gammaStart = gamma;
    active = false;
    sendEvent();
  };

  return {
    start: function() {
      start();
    },
    stop: function() {
      stop();
    }
  };

}]);

adaptive.directive('adaptive-scroll', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var getOptions = function () {
        return angular.extend({}, scope.$eval(attrs.adaptive-scroll));
      };
      var opts = getOptions();
      console.log(opts);

    }
  };
}]);


})();
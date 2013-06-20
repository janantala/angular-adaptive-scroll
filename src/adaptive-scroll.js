(function () {

var adaptive = angular.module('adaptive.scroll', []);

adaptive.factory('$gyroscope', ['$rootScope', function ($rootScope) {

  var startAlpha, startBeta, startGamma;
  var alpha, beta, gamma;
  var trashold = 30;
  var active;

  window.ondeviceorientation = function(event) {
    alpha = Math.round(event.alpha);
    beta = Math.round(event.beta);
    gamma = Math.round(event.gamma);

    if (active && Math.abs(startAlpha - alpha) > trashold) {
      sendEvent();
    }
  };

  var sendEvent = function() {

  };

  var start = function(trashold) {
    startAlpha = alpha;
    startBeta = beta;
    startGamma = gamma;
    trashold = trashold;
    active = true;
  };

  var stop = function() {
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